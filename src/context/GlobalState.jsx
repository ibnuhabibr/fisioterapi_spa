import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { seedData } from "../data/mockData.js";
import { actionTypes, appReducer, initialState } from "./AppReducer";

const STORAGE_KEY = "fisiomed-app-state-v1";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext({});

const nowISO = () => new Date().toISOString();

const randomId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now()
    .toString(36)
    .slice(-3)
    .toUpperCase()}`;

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        const parsed = JSON.parse(storedState);
        dispatch({ type: actionTypes.LOAD_STATE, payload: parsed });
      } else {
        dispatch({ type: actionTypes.LOAD_STATE, payload: seedData });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      }
    } catch (error) {
      console.error(
        "Gagal memuat data aplikasi, menggunakan seed data.",
        error
      );
      dispatch({ type: actionTypes.LOAD_STATE, payload: seedData });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const resetToSeed = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    dispatch({ type: actionTypes.LOAD_STATE, payload: seedData });
  }, []);

  const addPatient = useCallback((payload) => {
    const patient = {
      ...payload,
      id: payload.id ?? randomId("PAS"),
      createdAt: payload.createdAt ?? nowISO(),
      updatedAt: nowISO(),
    };
    dispatch({ type: actionTypes.ADD_PATIENT, payload: patient });
    return patient;
  }, []);

  const updatePatient = useCallback((id, updates) => {
    dispatch({
      type: actionTypes.UPDATE_PATIENT,
      payload: {
        ...updates,
        id,
        updatedAt: nowISO(),
      },
    });
  }, []);

  const deletePatient = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_PATIENT, payload: id });
  }, []);

  const addEmployee = useCallback((payload) => {
    const employee = {
      ...payload,
      id: payload.id ?? randomId("EMP"),
      joinedAt: payload.joinedAt ?? nowISO(),
    };
    dispatch({ type: actionTypes.ADD_EMPLOYEE, payload: employee });
    return employee;
  }, []);

  const updateEmployee = useCallback((id, updates) => {
    dispatch({
      type: actionTypes.UPDATE_EMPLOYEE,
      payload: {
        ...updates,
        id,
      },
    });
  }, []);

  const deleteEmployee = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_EMPLOYEE, payload: id });
  }, []);

  const addService = useCallback((payload) => {
    const service = {
      ...payload,
      id: payload.id ?? randomId("SRV"),
      active: payload.active ?? true,
    };
    dispatch({ type: actionTypes.ADD_SERVICE, payload: service });
    return service;
  }, []);

  const updateService = useCallback((id, updates) => {
    dispatch({
      type: actionTypes.UPDATE_SERVICE,
      payload: {
        ...updates,
        id,
      },
    });
  }, []);

  const deleteService = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_SERVICE, payload: id });
  }, []);

  const addVisit = useCallback((payload) => {
    const visit = {
      ...payload,
      id: payload.id ?? randomId("VIS"),
      createdAt: payload.createdAt ?? nowISO(),
      updatedAt: nowISO(),
    };
    dispatch({ type: actionTypes.ADD_VISIT, payload: visit });
    return visit;
  }, []);

  const updateVisit = useCallback((id, updates) => {
    dispatch({
      type: actionTypes.UPDATE_VISIT,
      payload: {
        ...updates,
        id,
        updatedAt: nowISO(),
      },
    });
  }, []);

  const deleteVisit = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_VISIT, payload: id });
  }, []);

  const addTransaction = useCallback((payload) => {
    const transaction = {
      ...payload,
      id: payload.id ?? randomId("TRX"),
      issuedAt: payload.issuedAt ?? nowISO(),
    };
    dispatch({ type: actionTypes.ADD_TRANSACTION, payload: transaction });
    return transaction;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    dispatch({
      type: actionTypes.UPDATE_TRANSACTION,
      payload: {
        ...updates,
        id,
      },
    });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_TRANSACTION, payload: id });
  }, []);

  const updateSettings = useCallback((updates) => {
    dispatch({ type: actionTypes.UPDATE_SETTINGS, payload: updates });
  }, []);

  const setActiveUser = useCallback((user) => {
    dispatch({
      type: actionTypes.SET_ACTIVE_USER,
      payload: {
        ...user,
        lastLogin: user.lastLogin ?? nowISO(),
      },
    });
  }, []);

  const addNotification = useCallback((message, severity = "info") => {
    dispatch({
      type: actionTypes.ADD_NOTIFICATION,
      payload: {
        id: randomId("NTF"),
        message,
        severity,
        createdAt: nowISO(),
      },
    });
  }, []);

  const dismissNotification = useCallback((notificationId) => {
    dispatch({
      type: actionTypes.DISMISS_NOTIFICATION,
      payload: notificationId,
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      dispatch,
      randomId,
      resetToSeed,
      addPatient,
      updatePatient,
      deletePatient,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addService,
      updateService,
      deleteService,
      addVisit,
      updateVisit,
      deleteVisit,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateSettings,
      setActiveUser,
      addNotification,
      dismissNotification,
    }),
    [
      state,
      hydrated,
      resetToSeed,
      addPatient,
      updatePatient,
      deletePatient,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addService,
      updateService,
      deleteService,
      addVisit,
      updateVisit,
      deleteVisit,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateSettings,
      setActiveUser,
      addNotification,
      dismissNotification,
    ]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
