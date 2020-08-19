import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import axios from 'axios';

import removeAccents from './util';

interface City {
  id: number,
  name: string
}

interface IBGEUFResponse {
  sigla: string,
  nome: string
}

interface IBGECityResponse {
  id: number,
  nome: string
}

interface Select {
  label: string,
  value: string
}

export default function App() {

  const [ ufs, setUFs ] = useState<Select[]>([]);
  const [ selectedUF, setSelectedUF ] = useState("");

  const [ cities, setCities ] = useState<City[]>([]);
  const [ selectedCity, setSelectedCity ] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [ originalCities, setOriginalCities ] = useState<City[]>(cities);

  const [ loading, setLoading ] = useState<Boolean>(false);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderby=nome').then(response => {
        if (response) {
            const ufInitials = response.data.map(uf => ({
              label: uf.nome, 
              value: uf.sigla
            }));
            setUFs(ufInitials);
        }
    });
  }, []);

  useEffect(() => {

    setCities([]);
    setLoading(true);

    if (selectedUF === '') {
        return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
        if (response) {

            const cities = response.data.map(city => ({
              id: city.id, 
              name: city.nome
            }));

            //Timeout para simular demora no carregamento das cidades e exibir o loading
            setTimeout(() => {
              setCities(cities);
              setOriginalCities(cities);
              setLoading(false);  
            }, 4000);
        }
    });
    
  }, [selectedUF]);

  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleFilterCity = (filter: string) => {

    const filteredCities = originalCities.filter(city => {
      return removeAccents(city.name.toLowerCase()).includes(removeAccents(filter.toLowerCase()));
      //return city.name.toLowerCase().includes(filter.toLowerCase());
    });

    setCities(filteredCities);
  }

  const renderItem = ({ item }: { item: City }) => (
    <TouchableWithoutFeedback onPress={ () => onItemPress(item)}>
        <Text style={styles.item}>{item.name}</Text>
    </TouchableWithoutFeedback>
  );

  const onItemPress = (city: City) => {
    setSelectedCity(city.name);
    handleModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>UF</Text>
      <RNPickerSelect
          onValueChange={(value) => setSelectedUF(value)}
          value={selectedUF}
          placeholder={{
              label: 'Qual a UF?',
              value: ''
          }}
          style={{ placeholder: { color: 'black' }, inputIOS: styles.inputSelect, inputAndroid: styles.inputSelect }}
          items={ufs}
      />
      
      <Text style={styles.label}>Cidade</Text>
      <TextInput 
          value={selectedCity}
          onTouchStart={handleModal}
          editable={false}
          style={styles.input} 
          placeholder="Qual a cidade?" 
          placeholderTextColor="black"
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.containerModal}>
          <Text style={styles.label}>Filtro</Text>
          <TextInput
              onChangeText={text => handleFilterCity(text)}
              style={styles.input} 
              placeholder="Digite para filtrar" 
              placeholderTextColor="black"
          />

          {loading ? 
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          :
            <View style={styles.list}>
              <FlatList
                data={cities}
                keyExtractor={city => String(city.id)}
                renderItem={renderItem}
              />
            </View>
          }

          <RectButton onPress={handleModal} style={styles.okButton}>
            <Text style={styles.okButtonText}>Fechar</Text>
          </RectButton>
        </View>
        
      </Modal>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#f0f0f7",
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
  },
  containerModal: {
    flex: 1,
    backgroundColor: "#f0f0f7",
    padding: 20
  },
  list: {
    flex: 1,
    backgroundColor: "#f0f0f7",
    width: '100%'
  },
  label: {
      color: 'purple',
      width: '100%',
      fontWeight: "bold"
  },
  input: {
      height: 54,
      backgroundColor: '#FFF',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginTop: 4,
      marginBottom: 16,
      width: '100%',
      fontWeight: "bold",
  },
  inputSelect: {
    height: 54,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    width: '100%',
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  listItem: {
    backgroundColor: '#CDD4E4',
    marginTop: 20,
    padding: 30,
  },
  loading: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  okButton: {
    backgroundColor: '#04d361',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  okButtonText: {
      color: '#FFF',
      fontSize: 16,
  }
});