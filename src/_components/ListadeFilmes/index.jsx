import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { buscarFilmesPorTermo } from "../../services/filmesApi";
import { useTheme } from "../../context/themeContext";
import { useTranslation } from "react-i18next";
import BaseScreens from "../BaseScreens/BaseScreens";

const termoInicial = "";

export default function ListaDeFilmes() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [termo, setTermo] = useState(termoInicial);

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["filmes", termo],
    queryFn: () => buscarFilmesPorTermo(termo),
    enabled: Boolean(termo && termo.trim().length > 0),
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <BaseScreens title={t("movies.titleMovie")} logoutButton>
      <TextInput
        placeholder={t("movies.moviesInputPlaceholder")}
        value={termo}
        onChangeText={setTermo}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.inputBg,
            color: colors.text,
          },
        ]}
        placeholderTextColor={colors.placeH}
        returnKeyType="search"
      />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loading}
        />
      ) : isError ? (
        <Text style={[styles.error, { color: colors.danger }]}>
          {t("errorRetrievingMovies")}{" "}
          {error?.reason ? `: ${error.reason}` : ""}
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.Poster !== "N/A" ? (
                <Image source={{ uri: item.Poster }} style={styles.poster} />
              ) : (
                <View
                  style={[
                    styles.poster,
                    styles.posterPlaceholder,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.posterPlaceholderText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Sem poster
                  </Text>
                </View>
              )}
              <View style={styles.meta}>
                <Text style={[styles.titleMovie, { color: colors.text }]}>
                  {item.Title}
                </Text>
                <Text style={[styles.year, { color: colors.textSecondary }]}>
                  ({item.Year})
                </Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.text }]}>
              {t("movies.noResultText")} "{termo}"
            </Text>
          }
          contentContainerStyle={data.length === 0 && styles.emptyContainer}
        />
      )}
    </BaseScreens>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    marginTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  posterPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  posterPlaceholderText: {
    fontSize: 12,
  },
  meta: {
    flexShrink: 1,
  },
  titleMovie: {
    fontSize: 16,
    fontWeight: "600",
  },
  year: {
    marginTop: 2,
    fontSize: 14,
  },
  separator: {
    height: 1,
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  error: {
    textAlign: "center",
    marginTop: 20,
  },
});
