import styled from "styled-components";
import{View,Text,Image,TextInput,TouchableOpacity} from 'react-native';
import Constants from "expo-constants";

const StatusBarHeight= Constants.statusBarHeight;
import {formik} from 'formik';
export const colors = {
    primary:"#ffffff",
    secondary:"#E5E7EB",
    tertiary:"#1f2937",
    darkLight: "#9CA3AF", 
    brand: "#6D28D9",
    green:"#008000",
    red: "#FF0000",
}

const{primary,secondary,tertiary,darkLight,brand,green,red}=colors;

export const StyledContainer = styled.View`
    flex:1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 100}px;

    background-color: ${primary};
`;

export const InnerContainer = styled.View`
    flex:1;
    width: 100%;
    align-items: center;
`;
export const pageLogo = styled.Image`
    width: 250px;
    height: 200px;
`;
export const PageTitle = styled.Text`
    font-size: 50px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;
    ${(props) => props.welcome && `
        font-size:35px;  
    `}
`;
export const SubTitle = styled.Text`
    font-size: 15px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
    ${(props) => props.welcome && `
    margin-bottom: 5px;
    font-weight:normal;

    `}
`;
export const StyledFormArea = styled.View`
width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color:${secondary};
    padding:15px;
    padding-left : 45px;
    padding-right: 45px;
    border-radius: 25px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};

`;
export const StyledInputLabel=styled.Text`
    font-size: 13px;
    text-align: left;
    color: ${tertiary};
`;
export const LeftIcon=styled.View`
    left: 15px;
    top: 38;
    position: absolute;
    z-index: 1;
`;
export const RightIcon=styled.TouchableOpacity`
    right: 15px;
    top: 38;
    position: absolute;
    z-index: 1;
`;
export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    margin-vertical: 5px;
    height: 60px;
    ${(props)=> props.google==true && `
    background-color: ${green};
        flex-direction: row;
        justify-content: center;
    `}
`;

export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;
    ${(props)=> props.google==true && `
    padding:5px;
    `}
`;
export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px;
`;
export const Line = styled.View`
    height:1px;
    width:100%;
    background-color: ${darkLight};
    margin-vertical: 10px;
`;
export const ExtraView=styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;
export const ExtraText=styled.Text`
    justify-content: center;
    align-content: center;
    color: ${tertiary};
    font-size: 15px;
`;
export const TextLink=styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;
export const TextLinkContent=styled.Text`
    color: ${brand};
    font-size: 15px;
    padding: 2px;
`;
export const WelcomeContainer=styled(InnerContainer)`
    padding: 25px;
    padding-top: 10px;
    justify-content: center;
`;
export const WelcomeImage=styled.Image`
    height: 45%;
    min-width: 100%;
`;
export const Avatar=styled.Image`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
`;
export const WelcomeMessage=styled.Text`
    font-size: 25px;
    text-align: center;
    color: ${brand};
    font-weight: bold;
    padding: 5px;
`;