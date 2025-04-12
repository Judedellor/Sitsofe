import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MaintenanceRequestTrackingScreen = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [image, setImage] = useState(null);

  const addRequest = () => {
    const newRequest = {
      id: requests.length + 1,
      status,
      priority,
      assignedTo,
      image,
    };
    setRequests([...requests, newRequest]);
    setStatus('');
    setPriority('');
    setAssignedTo('');
    setImage(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View>
      <Text>Maintenance Request Tracking</Text>
      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        placeholder="Priority"
        value={priority}
        onChangeText={setPriority}
      />
      <TextInput
        placeholder="Assigned To"
        value={assignedTo}
        onChangeText={setAssignedTo}
      />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Add Request" onPress={addRequest} />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Status: {item.status}</Text>
            <Text>Priority: {item.priority}</Text>
            <Text>Assigned To: {item.assignedTo}</Text>
            {item.image && <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} />}
          </View>
        )}
      />
    </View>
  );
};

export default MaintenanceRequestTrackingScreen;
