import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getDocs, collection, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';

const MemberScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser(); 
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks(); 
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user:", userData); 
          setUser({ id: userDoc.id, ...userData });
        } else {
          Alert.alert('No user found');
        }
      } else {
        Alert.alert('No user is currently authenticated');
      }
    } catch (error) {
      
      Alert.alert('Error fetching user');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!user || !user.id) {
     
      return;
    }

    try {
      const tasksCollection = collection(db, 'tasks');
      const tasksQuery = query(tasksCollection, where("assignedTo", "==", user.fullName));
      const querySnapshot = await getDocs(tasksQuery);
      const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

     
      tasksList.sort((a, b) => {
        const dateA = a.dueDate?.toDate() || new Date();
        const dateB = b.dueDate?.toDate() || new Date();
        return dateA - dateB;
      });

     

      setTasks(tasksList);
    } catch (error) {
      Alert.alert('Error fetching tasks');
    }
  };

  const completeTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { status: 'completed' });
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      ));
    } catch (error) {
      
      Alert.alert('Error completing task');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.header}>Welcome, {user.fullName}</Text>
          <Text style={styles.subText}>Email: {user.email}</Text>
          <Text style={styles.subText}>Role: {user.role}</Text>
        </View>
      )}
      {tasks.length === 0 ? (
        <Text>No tasks assigned to you.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Due Date: {item.dueDate?.toDate().toDateString() || 'No Due Date'}</Text>
              <Text>Priority: {item.priority}</Text>
              <Text>Created By: {item.createdBy}</Text>
              <Text>Status: {item.status || 'Not Started'}</Text>
              {item.status !== 'completed' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeTask(item.id)}
                >
                  <Text style={styles.completeButtonText}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subText: {
    fontSize: 18,
    color: '#555',
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    borderRadius:15
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  completeButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MemberScreen;
