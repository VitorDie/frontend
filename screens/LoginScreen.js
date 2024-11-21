import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [soundSuccess, setSoundSuccess] = useState();
  const [soundError, setSoundError] = useState();

  // Função para carregar sons personalizados
  const loadSystemSounds = async () => {
    try {
      const { sound: successSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/success.mp3') // Certifique-se de que o caminho do arquivo está correto
      );
      const { sound: errorSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/error.mp3') // Certifique-se de que o caminho do arquivo está correto
      );
      setSoundSuccess(successSound);
      setSoundError(errorSound);
    } catch (error) {
      console.error("Erro ao carregar os sons: ", error);
    }
  };

  // Carregar os sons quando o componente for montado
  useEffect(() => {
    loadSystemSounds();
  }, []);

  // Função para tocar o som de erro
  const playErrorSound = async () => {
    if (soundError) {
      await soundError.replayAsync();
    }
  };

  // Função para tocar o som de sucesso
  const playSuccessSound = async () => {
    if (soundSuccess) {
      await soundSuccess.replayAsync();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      playErrorSound(); // Toca som de erro
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.10:5000/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        playSuccessSound(); // Toca som de sucesso
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        const { token } = response.data;
        console.log('Token de autenticação:', token);
        navigation.navigate('UploadScreen');
      } else {
        playErrorSound(); // Toca som de erro
        Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      playErrorSound(); // Toca som de erro
      console.error('Erro de login:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Erro ao realizar login. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Button
        title="Não tem uma conta? Registre-se"
        onPress={() => navigation.navigate('RegisterScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
