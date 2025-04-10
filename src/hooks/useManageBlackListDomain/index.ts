import { useAppDispatch } from "../useAppDispatch";
import { sessionDataSlice } from "../../store/reducers/sessionDataReducer/sessionDataSlice";
import { useAppSelector } from "../useAppSelector";

export const useManageBlackListDomain = () => {
  const dispatch = useAppDispatch();
  const { setBlackList } = sessionDataSlice.actions;
  const { blackList } = useAppSelector(state => state.SessionDataSlice);

  const getActualBlackList = async (): Promise<string[]> => {
    return new Promise(resolve => {
      chrome.storage.local.get("blackList", result => {
        resolve(result.blackList || []);
      });
    });
  };

  const setActualBlackList = async (blackList: string[]): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ blackList }, () => {
        resolve();
      });
    });
  };

  const handleSetBlackList = async (): Promise<void> => {
    const blackList = await getActualBlackList();

    dispatch(setBlackList(blackList));
  };

  const handleAddItemToBlackList = async (domain: string): Promise<void> => {
    if (blackList.includes(domain)) return;

    const updatedBlackList = [...blackList, domain];

    dispatch(setBlackList(updatedBlackList));
    await setActualBlackList(updatedBlackList);
  }

  const handleRemoveItemFromBlackList = async (domain: string): Promise<void> => {
    const updatedBlackList = blackList.filter(d => d !== domain);

    dispatch(setBlackList(updatedBlackList));
    await setActualBlackList(updatedBlackList);
  }


  return {
    handleSetBlackList,
    handleAddItemToBlackList,
    handleRemoveItemFromBlackList,
  }
};