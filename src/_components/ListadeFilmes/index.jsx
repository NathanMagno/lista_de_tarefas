
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { buscarFilmesPorTermo } from '../../services/filmesApi';

const termoInicial = '';

export default function ListaDeFilmes() {
  const [termo, setTermo] = useState(termoInicial);

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['filmes', termo],
    queryFn: () => buscarFilmesPorTermo(termo),
    enabled: Boolean(termo && termo.trim().length > 0),
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Filmes</Text>

      <TextInput
        placeholder="Buscar filmes (ex: Batman)"
        value={termo}
        onChangeText={setTermo}
        style={styles.input}
        returnKeyType="search"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4c6ef5" style={styles.loading} />
      ) : isError ? (
        <Text style={styles.error}>
          Erro ao carregar filmes{error?.reason ? `: ${error.reason}` : ''}
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.Poster !== 'N/A' ? (
                <Image source={{ uri: item.Poster }} style={styles.poster} />
              ) : (
                <View style={[styles.poster, styles.posterPlaceholder]}>
                  <Text style={styles.posterPlaceholderText}>Sem poster</Text>
                </View>
              )}
              <View style={styles.meta}>
                <Text style={styles.titleMovie}>{item.Title}</Text>
                <Text style={styles.year}>({item.Year})</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isLoading} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum resultado para "{termo}"</Text>
          }
          contentContainerStyle={data.length === 0 && styles.emptyContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#232323ff',
  },
  loading: {
    marginTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#ffffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterPlaceholderText: {
    fontSize: 12,
    color: '#ffffffff',
  },
  meta: {
    flexShrink: 1,
  },
  titleMovie: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffffff',
  },
  year: {
    marginTop: 2,
    fontSize: 14,
    color: '#bcbcbcff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eaeaea',
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#5a5a5aff',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
