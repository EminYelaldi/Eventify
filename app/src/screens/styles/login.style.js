import { StyleSheet } from "react-native";
export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF', // SafeAreaView'in beyaz kalmasını önlemek için siyah
  },
  backLink: {
    position: 'absolute', // Sabit konum
    top: 10, 
    left: 10, 
    zIndex: 10, 
    padding: 8, 
  },
  backLinkText: {
    fontSize: 16,
    color: '#1D1E24', // Fosforlu sarı renk
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Yandan biraz boşluk bırakır
    backgroundColor: '#FFF', // Siyah arka plan
    paddingBottom:70,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 5,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#1D1E24', // Fosforlu sarı
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 0.5,
    borderColor: '#f0f0f0', // Fosforlu sarı kenarlık
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f0f0f0', // Koyu gri arka plan
    color: '#1D1E24', // Fosforlu sarı metin
  },
  passwordInput:{
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    position: 'relative',
  },
  eyeIcon:{
    position: 'absolute',
    right: 10,
    top: '40%',
    transform: [{ translateY: -5 }], // Göz ikonunu dikey ortalamak için
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9B741', // Fosforlu sarı
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    marginTop:10,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEF3E2', // Siyah yazı
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facebookButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 30, // Adjust the size of the logo
    height: 30, // Ensure the logo fits well
    resizeMode: 'contain', // Prevent distortion
  },
  iconContainer: {
    marginRight: 10, // İkon ve yazı arasındaki boşluk
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#1D1E24',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    alignItems: 'right',
    marginVertical: 3,
    marginTop:10,
    width:'100%',
  },
  linkText: {
    fontSize: 14,
    color: '#1D1E24', // Fosforlu sarı
    textAlign:"right",
  },
  goBackText: {
    fontSize: 16,
    color: '#E9B741',
    marginTop:30,

  },
  authcontainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center the buttons vertically
    marginTop: 20,
    gap: 40, // Add consistent space between the buttons
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#666',
    marginHorizontal: 16,
    fontSize: 14,
  },
  
  
});