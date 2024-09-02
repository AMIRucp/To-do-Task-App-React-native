import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useIsFocused } from '@react-navigation/native';
const HomeScreen = ({ route, navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('Low');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [user, setUser] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && user) {
      fetchTasks();
    }
  }, [isFocused, user]);

  useEffect(() => {
    if (route.params) {
      const { fullName, email, role, id } = route.params;
      setUser({ fullName, email, role, id });
    }
  }, [route.params]);

  const fetchTasks = async () => {
    if (!user) {
      
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (user.role !== 'admin') {
        setTasks(tasksList.filter(task => task.assignedTo === user.id));
      } else {
        setTasks(tasksList);
      }
    } catch (error) {
      
      Alert.alert('Error fetching tasks');
    }
  };

  const addTask = async () => {
    if (!title || !description) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (!user) {
      Alert.alert('User is not set.');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        dueDate: Timestamp.fromDate(dueDate),
        priority,
        createdBy: user.fullName,
        assignedTo: user.role === 'admin' ? assignedTo : user.id,
        status: false
      });
      resetForm();
      fetchTasks();
    } catch (error) {
     
      Alert.alert('Error adding task');
    }
  };

  const updateTask = async () => {
    if (!taskToUpdate) {
      Alert.alert('No task selected for update.');
      return;
    }

    try {
      await updateDoc(doc(db, 'tasks', taskToUpdate.id), {
        title,
        description,
        dueDate: Timestamp.fromDate(dueDate),
        priority,
        assignedTo,
        status: taskToUpdate.status
      });
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error("Error updating task: ", error);
      Alert.alert('Error updating task');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setPriority('Low');
    setAssignedTo('');
    setShowUpdateForm(false);
    setTaskToUpdate(null);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(new Date(dueDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())));
  };

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowTimePicker(false);
    setDueDate(new Date(dueDate.setHours(currentDate.getHours(), currentDate.getMinutes())));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && (
        <>
          <View style={styles.userInfo}>
            <Text style={styles.header}>Welcome, {user.fullName}</Text>
            <Text style={styles.subText}>Email: {user.email}</Text>
            <Text style={styles.subText}>Role: {user.role}</Text>
          </View>
        </>
      )}
      {user?.role === 'admin' && !showUpdateForm && (
        <View style={styles.taskForm}>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={styles.datePickerButton}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity onPress={showTimepicker}>
            <Text style={styles.datePickerButton}>Due Time: {dueDate.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Assign To (Enter Full name)"
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={addTask}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      )}
      {showUpdateForm && (
        <View style={styles.taskForm}>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={styles.datePickerButton}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity onPress={showTimepicker}>
            <Text style={styles.datePickerButton}>Due Time: {dueDate.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Assign To (Enter user ID)"
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
          <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={updateTask}>
            <Text style={styles.buttonText}>Update Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowUpdateForm(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskDueDate}>Due: {item.dueDate.toDate().toDateString()} {item.dueDate.toDate().toLocaleTimeString()}</Text>
            <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
            <Text style={styles.taskAssignedTo}>Assigned To: {item.assignedTo}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={() => {
                setTaskToUpdate(item);
                setTitle(item.title);
                setDescription(item.description);
                setDueDate(item.dueDate.toDate());
                setPriority(item.priority);
                setAssignedTo(item.assignedTo);
                setShowUpdateForm(true);
              }}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => {
                Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteDoc(doc(db, 'tasks', item.id));
                      fetchTasks();
                    }
                  }
                ]);
              }}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    backgroundColor: '#f8f9fa',
  },
  userInfo: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  taskForm: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 15,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  updateButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  taskDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  taskDueDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  taskPriority: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  taskAssignedTo: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
