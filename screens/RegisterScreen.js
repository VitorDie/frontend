import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    try {
      // Envia os dados para a API
      const response = await axios.post('http://192.168.1.10:5000/api/auth/register', {
        name,  // Envia o nome (não "username")
        email,
        password,
      });

      // Verifica a resposta da API
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
        navigation.navigate('LoginScreen'); // Após o registro, vai para a tela de login
      } else {
        Alert.alert('Erro', 'Erro ao registrar o usuário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de registro:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Erro ao registrar o usuário. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      {/* Campo de nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      {/* Campo de e-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botão para enviar os dados */}
      <Button title="Registrar" onPress={handleRegister} />
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
