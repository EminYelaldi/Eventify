import { StyleSheet } from "react-native";
export default StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF', // SafeAreaView'in beyaz kalmasını önlemek için
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16, // Yandan biraz boşluk bırakır
    backgroundColor: '#FFF', // Düz arka plan rengi
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#1D1E24',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9B741',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  goBackText: {
    fontSize: 16,
    color: '#E9B741',
    marginTop:30,

  },
  backContainer:{
    justifyContent:'space-between',
    flexDirection: "row",
  },
  accountText:{
    fontSize: 16,
    color:'#1D1E24',
    marginRight:4,
    marginTop:30,
  },
  
});