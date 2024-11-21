import React, { useState } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState(null); // Armazenar URI da imagem

  // Função para abrir o seletor de imagens
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria de imagens.');
      return;
    }

    // Abre o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
    });

    // Verifica se o usuário selecionou uma imagem
    if (!result.cancelled) {
      console.log('Imagem selecionada:', result.assets[0]?.uri); // Exibe o URI da imagem selecionada
      setImageUri(result.assets[0]?.uri);  // Armazena o URI da imagem
    } else {
      console.log('Nenhuma imagem selecionada');
    }
  };

  // Função para enviar a imagem para o servidor
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Erro', 'Selecione uma imagem antes de enviar.');
      return;
    }

    console.log('Enviando imagem:', imageUri); // Exibe o URI da imagem que será enviada

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/png',  // Tipo de imagem
      name: 'image.png',  // Nome do arquivo
    });

    try {
      const response = await axios.post('http://192.168.1.10:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Imagem enviada com sucesso:', response.data); // Exibe resposta do servidor
      Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      Alert.alert('Erro', 'Erro ao enviar a imagem.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma Imagem PNG</Text>

      {/* Botão para selecionar a imagem */}
      <Button title="Selecionar Imagem" onPress={pickImage} />

      {/* Exibe a imagem selecionada */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {/* Botão para enviar a imagem */}
      <Button
        title="Enviar Imagem"
        onPress={uploadImage}
        disabled={!imageUri}  // Desabilita o botão caso nenhuma imagem tenha sido selecionada
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
});
