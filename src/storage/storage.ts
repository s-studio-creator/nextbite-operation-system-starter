import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData<T>(key: string): Promise<T | null> {
  const rawValue = await AsyncStorage.getItem(key);

  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    await removeData(key);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
