import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 16,
    color: '#1D1E24',
    letterSpacing: 0.5,
    textAlign:'center',
  },
  fixedSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  eventImage: {
    width: width - 32,
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 16,
    color: '#333',
    lineHeight: 22,
  },
  label: {
    fontWeight: '700',
    color: '#1D1E24',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  reminderButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#E9B741',
    borderRadius: 12,
    shadowColor: '#E9B741',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  reminderButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
  },
  favoriteButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#789DBC',
    borderRadius: 12,
    shadowColor: '#789DBC',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  favoriteButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
  },
  commentsSection: {
    marginTop: 24,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1D1E24',
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1E24',
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
    marginTop: 8,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  ratingContainer: {
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#999',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  commentInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  ratingInputContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: '#E9B741',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  averageRatingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1E24',
    marginRight: 8,
  },
  averageRatingLabel: {
    fontSize: 14,
    color: '#666',
  },
  eventDetails: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    marginTop: -20,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1E24',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
});
