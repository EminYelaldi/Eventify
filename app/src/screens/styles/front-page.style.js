import { StyleSheet } from "react-native";

export default StyleSheet.create({
    
    image: {
      width:380,
      height:380,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#FFF',
      marginBottom:40,

    },
    overlay: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      alignItems: 'center',
      backgroundColor:'#FFF',
      paddingHorizontal: 20,
      paddingBottom:10,
    },
    title: {
      fontSize: 50,
      fontWeight: 'bold',
      color: '#1D1E24',
      textAlign: 'center',
      marginTop:20,
      fontFamily: 'BebasNeue', // Daha önce yüklenen font
    },
    getStartedButton: {
      width: '40%',
      height: 50,
      backgroundColor: '#E9B741', // Fosforlu sarı
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 40,
      flexDirection:'row',
      justifyContent:'space-between',
    },
    loginButton: {
      width: '40%',
      height: 50,
      borderWidth: 2,
      borderColor: '#E9B741', // Fosforlu sarı kenarlık
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    },
    getStartedText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF', // Siyah yazı
      
    },
    loginText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1D1E24', // Siyah yazı
      
    },
  });