import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    backLink: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    backLinkText: {
        fontSize: 16,
        color: '#E9B741',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    header: {
         fontSize: 35, 
         fontWeight: 'bold',
          margin: 16, 
          textAlign: 'center',
           color: '#333' 
        },
    map: { 
        height: 300, 
        margin: 16, 
        borderRadius: 12 
    },
    eventDetails: {
        padding: 16,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        borderColor:'#f2f2f2',
        borderWidth:1,
    },
    eventTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 8, 
        textAlign: 'center' 
    },
    navigationButton: {
        padding: 12,
        backgroundColor: '#E9B741',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    navigationText: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
    nearbyHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
        textAlign: 'center',
        color: '#333',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 8,
    },
    nearbyEventCard: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        borderColor:'#f2f2f2',
        borderWidth:1,
    },
    nearbyEventTitle: { 
        fontSize: 16, 
        textAlign: 'center',
         color: '#1D1E24',
         },
});