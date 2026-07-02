import { useCallback, useEffect, useRef, useState } from "react";
import { CompanionDialogueMoment, CompanionDialogueState } from "../types";
import { DialogueContext, applyDialogueLine, chooseCompanionDialogue } from "../utils/dialogue";
import { getTodayKey } from "../utils/wellness";
import { loadData, saveData } from "./storage";

const dialogueStateKey = "calorie-map:companion-dialogue-state";

const defaultDialogueState: CompanionDialogueState = {
  recentLineIds: []
};

export async function loadCompanionDialogueState(): Promise<CompanionDialogueState | null> {
  return loadData<CompanionDialogueState>(dialogueStateKey);
}

export async function saveCompanionDialogueState(state: CompanionDialogueState): Promise<void> {
  await saveData(dialogueStateKey, state);
}

export function useCompanionDialogue() {
  const [dialogueState, setDialogueState] = useState<CompanionDialogueState>(defaultDialogueState);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateDialogue() {
      const storedState = await loadCompanionDialogueState();

      if (!isMounted) {
        return;
      }

      setDialogueState(storedState ?? defaultDialogueState);
      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateDialogue();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveCompanionDialogueState(dialogueState);
  }, [dialogueState]);

  const surfaceDialogue = useCallback(
    (moment: CompanionDialogueMoment, context: Omit<DialogueContext, "moment">) => {
      if (moment === "dailyOpen" && dialogueState.lastDailyOpenDate === getTodayKey()) {
        return;
      }

      const line = chooseCompanionDialogue({ ...context, moment }, dialogueState);

      if (!line) {
        return;
      }

      setDialogueState((current) => applyDialogueLine(current, line));
    },
    [dialogueState]
  );

  return {
    dialogueState,
    surfaceDialogue,
    isHydrated
  };
}
