export const actionTypes = {
  LOAD_STATE: "LOAD_STATE",
  RESET_STATE: "RESET_STATE",
  ADD_PATIENT: "ADD_PATIENT",
  UPDATE_PATIENT: "UPDATE_PATIENT",
  DELETE_PATIENT: "DELETE_PATIENT",
  ADD_EMPLOYEE: "ADD_EMPLOYEE",
  UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
  ADD_SERVICE: "ADD_SERVICE",
  UPDATE_SERVICE: "UPDATE_SERVICE",
  DELETE_SERVICE: "DELETE_SERVICE",
  ADD_VISIT: "ADD_VISIT",
  UPDATE_VISIT: "UPDATE_VISIT",
  DELETE_VISIT: "DELETE_VISIT",
  ADD_TRANSACTION: "ADD_TRANSACTION",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  SET_ACTIVE_USER: "SET_ACTIVE_USER",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  DISMISS_NOTIFICATION: "DISMISS_NOTIFICATION",
};

export const initialState = {
  patients: [],
  employees: [],
  services: [],
  visits: [],
  transactions: [],
  settings: {
    clinicName: "",
    address: "",
    phone: "",
    email: "",
    operatingHours: "",
    autoAssignTherapist: true,
    sendDailySummary: false,
    whatsappReminder: false,
  },
  meta: {
    activeUser: null,
    notifications: [],
  },
};

const updateCollection = (collection, nextItem) =>
  collection.map((item) =>
    item.id === nextItem.id ? { ...item, ...nextItem } : item
  );

const deleteFromCollection = (collection, id) =>
  collection.filter((item) => item.id !== id);

export const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOAD_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.RESET_STATE:
      return { ...initialState };

    case actionTypes.ADD_PATIENT:
      return { ...state, patients: [action.payload, ...state.patients] };
    case actionTypes.UPDATE_PATIENT:
      return {
        ...state,
        patients: updateCollection(state.patients, action.payload),
      };
    case actionTypes.DELETE_PATIENT:
      return {
        ...state,
        patients: deleteFromCollection(state.patients, action.payload),
      };

    case actionTypes.ADD_EMPLOYEE:
      return { ...state, employees: [action.payload, ...state.employees] };
    case actionTypes.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: updateCollection(state.employees, action.payload),
      };
    case actionTypes.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: deleteFromCollection(state.employees, action.payload),
      };

    case actionTypes.ADD_SERVICE:
      return { ...state, services: [action.payload, ...state.services] };
    case actionTypes.UPDATE_SERVICE:
      return {
        ...state,
        services: updateCollection(state.services, action.payload),
      };
    case actionTypes.DELETE_SERVICE:
      return {
        ...state,
        services: deleteFromCollection(state.services, action.payload),
      };

    case actionTypes.ADD_VISIT:
      // 🎯 AUTO-CREATE TRANSACTION: Jika ada pembayaran (DP/Lunas), buat transaksi otomatis
      const newVisit = action.payload;
      let autoTransaction = null;

      // Jika payment status bukan "Belum Bayar", buat transaksi otomatis
      if (newVisit.paymentStatus !== "Belum Bayar" && newVisit.paymentMethod) {
        const transactionAmount =
          newVisit.paymentStatus === "DP 50%"
            ? Math.round(newVisit.total * 0.5)
            : newVisit.total;

        const transactionStatus =
          newVisit.paymentStatus === "Lunas" ? "Lunas" : "DP";

        autoTransaction = {
          id: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          reference: `INV-${new Date().getFullYear()}-${Math.floor(
            Math.random() * 900 + 100
          )}`,
          visitId: newVisit.id,
          patientId: newVisit.patientId,
          amount: transactionAmount,
          method: newVisit.paymentMethod,
          status: transactionStatus,
          notes: `Pembayaran otomatis saat pendaftaran kunjungan (${newVisit.paymentStatus})`,
          issuedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
      }

      return {
        ...state,
        visits: [action.payload, ...state.visits],
        // Tambahkan transaksi otomatis jika ada pembayaran
        transactions: autoTransaction
          ? [autoTransaction, ...state.transactions]
          : state.transactions,
      };
    case actionTypes.UPDATE_VISIT:
      return {
        ...state,
        visits: updateCollection(state.visits, action.payload),
      };
    case actionTypes.DELETE_VISIT:
      return {
        ...state,
        visits: deleteFromCollection(state.visits, action.payload),
      };

    case actionTypes.ADD_TRANSACTION:
      // Auto-sync: Update visit paymentStatus berdasarkan transaction status
      const newTransaction = action.payload;
      const visitToUpdate = state.visits.find(
        (v) => v.id === newTransaction.visitId
      );

      let updatedVisits = state.visits;
      if (visitToUpdate) {
        const newPaymentStatus =
          newTransaction.status.toLowerCase() === "lunas"
            ? "Lunas"
            : newTransaction.status.toLowerCase() === "dp"
            ? "DP 50%"
            : "Belum Bayar";

        updatedVisits = state.visits.map((visit) =>
          visit.id === newTransaction.visitId
            ? {
                ...visit,
                paymentStatus: newPaymentStatus,
                updatedAt: new Date().toISOString(),
              }
            : visit
        );
      }

      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        visits: updatedVisits,
      };

    case actionTypes.UPDATE_TRANSACTION:
      // Auto-sync: Update visit paymentStatus saat transaction diupdate
      const updatedTransaction = action.payload;
      const visitToSync = state.visits.find(
        (v) => v.id === updatedTransaction.visitId
      );

      let syncedVisits = state.visits;
      if (visitToSync) {
        const syncedPaymentStatus =
          updatedTransaction.status.toLowerCase() === "lunas"
            ? "Lunas"
            : updatedTransaction.status.toLowerCase() === "dp"
            ? "DP 50%"
            : "Belum Bayar";

        syncedVisits = state.visits.map((visit) =>
          visit.id === updatedTransaction.visitId
            ? {
                ...visit,
                paymentStatus: syncedPaymentStatus,
                updatedAt: new Date().toISOString(),
              }
            : visit
        );
      }

      return {
        ...state,
        transactions: updateCollection(state.transactions, action.payload),
        visits: syncedVisits,
      };

    case actionTypes.DELETE_TRANSACTION:
      // Auto-sync: Reset visit paymentStatus ke "Belum Bayar" jika transaksi dihapus
      const deletedTransaction = state.transactions.find(
        (t) => t.id === action.payload
      );
      let resetVisits = state.visits;

      if (deletedTransaction) {
        resetVisits = state.visits.map((visit) =>
          visit.id === deletedTransaction.visitId
            ? {
                ...visit,
                paymentStatus: "Belum Bayar",
                updatedAt: new Date().toISOString(),
              }
            : visit
        );
      }

      return {
        ...state,
        transactions: deleteFromCollection(state.transactions, action.payload),
        visits: resetVisits,
      };

    case actionTypes.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case actionTypes.SET_ACTIVE_USER:
      return {
        ...state,
        meta: {
          ...state.meta,
          activeUser: { ...action.payload },
        },
      };
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        meta: {
          ...state.meta,
          notifications: [action.payload, ...state.meta.notifications],
        },
      };
    case actionTypes.DISMISS_NOTIFICATION:
      return {
        ...state,
        meta: {
          ...state.meta,
          notifications: deleteFromCollection(
            state.meta.notifications,
            action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default appReducer;
