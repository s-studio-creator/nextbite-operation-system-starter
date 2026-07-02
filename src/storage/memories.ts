import { useCallback, useEffect, useRef, useState } from "react";
import { EmotionalMemory, MemoryKind } from "../types";
import { loadData, saveData } from "./storage";

const memoriesKey = "calorie-map:emotional-memories";

export async function loadMemories(): Promise<EmotionalMemory[] | null> {
  return loadData<EmotionalMemory[]>(memoriesKey);
}

export async function saveMemories(memories: EmotionalMemory[]): Promise<void> {
  await saveData(memoriesKey, memories);
}

export function useEmotionalMemories() {
  const [memories, setMemories] = useState<EmotionalMemory[]>([]);
  const [activeFilter, setActiveFilter] = useState<MemoryKind | "all">("all");
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateMemories() {
      const storedMemories = await loadMemories();

      if (!isMounted) {
        return;
      }

      setMemories(storedMemories ?? []);
      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateMemories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveMemories(memories);
  }, [memories]);

  const addMemory = useCallback((memory: EmotionalMemory) => {
    setMemories((current) => [memory, ...current].slice(0, 200));
  }, []);

  const addMemories = useCallback((nextMemories: EmotionalMemory[]) => {
    if (nextMemories.length === 0) {
      return;
    }

    setMemories((current) => [...nextMemories, ...current].slice(0, 200));
  }, []);

  const filteredMemories = activeFilter === "all" ? memories : memories.filter((memory) => memory.kind === activeFilter);

  return {
    memories,
    filteredMemories,
    activeFilter,
    setActiveFilter,
    addMemory,
    addMemories,
    isHydrated
  };
}
