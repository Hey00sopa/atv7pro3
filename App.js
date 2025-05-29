import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import axios from 'axios';

export default function TelaClima() {
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [cidade, setCidade] = useState('');

  const buscarClima = useCallback(async () => {
    setCarregando(true);
    try {
      const resposta = await axios.get(`http://192.168.18.55:3000/weather?city=${cidade}`);
      setClima(resposta.data.results);
    } catch (erro) {
      console.error('Erro ao buscar dados do clima:', erro);
    } finally {
      setCarregando(false);
    }
  }, [cidade]);

  useEffect(() => {
    buscarClima();
  }, []);

  const renderizarIcone = (condicao) => {
    switch (condicao) {
      case 'rain':
        return (
          <>
            <Icon name="cloud" size={60} color="#87CEEB" />
            <Icon name="umbrella" size={40} color="#00BFFF" style={{ marginLeft: -15 }} />
          </>
        );
      case 'storm':
        return <Icon name="bolt" size={60} color="#FFD700" />;
      case 'cloud':
        return <Icon name="cloud" size={60} color="#ccc" />;
      default:
        return <Icon name="wb-sunny" size={60} color="#FFD700" />;
    }
  };

  if (carregando) {
    return (
      <ActivityIndicator size="large" color="#fff" style={estilos.carregando} />
    );
  }

  if (!clima) {
    return (
      <Text style={estilos.textoErro}>Erro ao carregar dados do clima.</Text>
    );
  }

  return (
    <View style={estilos.container}>

      {/* Campo de busca */}
      <View style={estilos.areaBusca}>
        <TextInput
          style={estilos.inputCidade}
          value={cidade}
          onChangeText={setCidade}
          placeholder="Digite a cidade"
          placeholderTextColor="#fff"
        />
        <Button title="Buscar" onPress={buscarClima} />
      </View>

      {/* Ícone do clima */}
      <View style={estilos.areaIcone}>
        {renderizarIcone(clima.condition_slug)}
      </View>

      {/* Dados principais */}
      <Text style={estilos.temperatura}>{clima.temp}°</Text>
      <Text style={estilos.subTexto}>
        Máx.: {clima.forecast[0].max}° Mín.: {clima.forecast[0].min}°
      </Text>

      {/* Detalhes adicionais */}
      <View style={estilos.detalhes}>
        <Text>💧 {clima.rain} mm</Text>
        <Text>💦 {clima.humidity}%</Text>
        <Text>🌬 {clima.wind_speedy}</Text>
      </View>

      {/* Previsão para hoje */}
      <Card containerStyle={estilos.card}>
        <Text style={estilos.tituloSecao}>
          Hoje - {new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}
        </Text>
        <View style={estilos.linhaPrevisao}>
          {clima.forecast.slice(0, 4).map((item, index) => (
            <View key={index} style={estilos.itemPrevisao}>
              <Text style={estilos.temperaturaPrevisao}>{item.max}°C</Text>
              <Icon name="cloud" color="#4DB6E9" />
              <Text style={estilos.dataPrevisao}>{item.date}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Próximas previsões */}
      <Card containerStyle={estilos.card}>
        <Text style={estilos.tituloSecao}>Próxima Previsão</Text>
        <View style={estilos.containerProximos}>
          {clima.forecast.slice(1, 3).map((dia, index) => (
            <View key={index} style={estilos.itemProximo}>
              <Text style={estilos.diaProximo}>{dia.weekday}</Text>
              <Text style={estilos.temperaturaProxima}>
                {dia.max}° | {dia.min}°
              </Text>
            </View>
          ))}
        </View>
      </Card>

    </View>
  );
}

const estilos = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#4DB6E9',
  },
  textoErro: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 18,
    backgroundColor: '#4DB6E9',
  },
  container: {
    flex: 1,
    backgroundColor: '#4DB6E9',
    alignItems: 'center',
    paddingTop: 50,
  },
  areaBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputCidade: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
    paddingVertical: 5,
    width: 150,
  },
  areaIcone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatura: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  subTexto: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  detalhes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 10,
  },
  card: {
    width: '90%',
    borderRadius: 10,
  },
  tituloSecao: {
    fontSize: 18,
    marginBottom: 10,
  },
  linhaPrevisao: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
  },
  itemPrevisao: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 70,
  },
  temperaturaPrevisao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4DB6E9',
  },
  dataPrevisao: {
    fontSize: 12,
    color: '#333',
  },
  containerProximos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  itemProximo: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 100,
  },
  diaProximo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4DB6E9',
  },
  temperaturaProxima: {
    fontSize: 14,
    color: '#333',
  },
});
