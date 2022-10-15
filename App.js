/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, Alert, TouchableHighlight } from 'react-native';

import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import { Icon } from "@rneui/themed";

const ngrok_server = 'https://7fc9-45-70-35-98.sa.ngrok.io'


export default function App() {
  const [todos, setTodos] = useState();
  const [defaultTodo, setDefaultTodo] = useState('')

  const fetchTodos = () => {
    axios.get(ngrok_server+'/api/todos')
      .then(function(response){
        setTodos(response.data)
      }).catch(function(error){
        console.log(error)
      })
  }

  const createTodo = () => {
    axios.post(ngrok_server+'/api/todos', {todo: {title: defaultTodo}})
      .then(function(response){
        fetchTodos()
      }).catch(function(error){
        console.log(error)
      })
  }

  const updateTodo = (todoId) => {
    axios.put(ngrok_server+'/api/todos/'+todoId, {todo: {done: true}})
    .then(function (response) {
      fetchTodos()
      return true;
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  const removeActions = (todoId) => {
    Alert.alert(
      "Remove Todo",
      "This todo will be removed on web",
      [
        {
          text: "Cancel",
          onPress: () => true,
          style: "cancel"
        },
        { text: "OK", onPress: () => removeTodo(todoId) }
      ]
    );
  }

  const removeTodo = (todoId) => {
    axios.delete(ngrok_server+'/api/todos/'+todoId)
    .then(function (response) {
      fetchTodos()
      return true;
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  const Todo = ({ todo }) => (
    <View style={styles.todoContainer}>
      <View>
        <Text style={[styles.todoTitle, todo.done ? '' : styles.todoTitleDone]}>{todo.title}</Text>
      </View>
      <View style={styles.buttonActions}>
        {!todo.done ?
        <TouchableHighlight style={styles.btnList}  onPress={() => updateTodo(todo.id)}>
          <Text style={styles.btnListText}>Up</Text>
        </TouchableHighlight>
        :
        <></>
        }
        <TouchableHighlight style={styles.btnList} onPress={() => removeActions(todo.id)}>
          <Text style={styles.btnListText}>Del</Text>
        </TouchableHighlight>
      </View>
    </View>
  );

  const renderTodo = ({ item }) => (
    <Todo todo={item} />
  );

  useEffect(() => {
    fetchTodos()


    OneSignal.setAppId('8a54851a-9a06-4d36-90b0-c80e14f5961c');

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData
      console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My todo list</Text>
      </View>
      <FlatList data={todos} renderItem={renderTodo} keyExtractor={todo => todo.id} style={styles.todoListContainer} />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder='Text for your TODO' placeholderTextColor='#FFF' style={styles.textInput} onChangeText={text => setDefaultTodo(text)} value={defaultTodo} defaultValue={defaultTodo} />
          <TouchableHighlight style={styles.btn} onPress={() => createTodo()}>
            <Text style={styles.btnText}>Add</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    margin: 2,
    borderColor: '#fff',
    backgroundColor: '#eb6b34',
  },

  btnText:{
    color: '#fff'
  },

  btnList: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    margin: 2,
    borderColor: '#eb6b34',
    backgroundColor: '#fff',
  },

  btnListText:{
    color: '#eb6b34'
  },



  container: {
    flex: 1
  },

  header: {
    padding: 20,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20
  },

  inputContainer: {
    backgroundColor: '#eb6b34',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 30
  },

  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#eb6b34'
  },

  todoListContainer: {
    marginBottom: 100
  },

  todoContainer: {
    borderWidth: 1,
    borderColor: '#eb6b34',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  buttonActions: {
    flexDirection: 'row'
  },

  todoTitle: {
    fontSize: 10,
    color: '#eb6b34'
  },

  todoTitleDone: {
    fontSize: 10,
    color: '#eb6b34',
    textDecorationLine: 'line-through'
  },

  textInput:{
    color: '#fff'
  }
});

