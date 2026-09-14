"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";

export type ShippingAddress = {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  label?: string;
};

type AddressContextValue = {
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress | null;
  selectAddress: (id: string) => void;
  addAddress: (input: Omit<ShippingAddress, "id">) => ShippingAddress;
  removeAddress: (id: string) => void;
};

const AddressContext = createContext<AddressContextValue | null>(null);

const ADDRESSES_KEY = "atlas-addresses";
const SELECTED_KEY = "atlas-address-selected";

const seedAddresses: ShippingAddress[] = [
  {
    id: "home",
    label: "Home",
    name: "Eleanor Vance",
    line1: "1042 Hillside Manor Drive",
    line2: "Suite 200",
    city: "Los Angeles",
    postalCode: "90012",
    country: "United States",
    phone: "+1 (555) 019-2834",
  },
  {
    id: "office",
    label: "Office",
    name: "Eleanor Vance",
    line1: "555 Market Street",
    line2: "34th Floor",
    city: "San Francisco",
    postalCode: "94104",
    country: "United States",
    phone: "+1 (555) 442-8899",
  },
  {
    id: "vacation",
    label: "Vacation Home",
    name: "Eleanor Vance",
    line1: "12 Aspen Retreat Road",
    city: "Aspen",
    postalCode: "81611",
    country: "United States",
    phone: "+1 (555) 837-9102",
  },
];

const DEFAULT_SELECTED_ID = seedAddresses[0].id;

const addressesStore = new LocalStorageStore<ShippingAddress[]>(
  ADDRESSES_KEY,
  seedAddresses,
  (value) =>
    Array.isArray(value) &&
    value.some(
      (entry) =>
        entry !== null &&
        typeof entry === "object" &&
        typeof entry.id === "string" &&
        typeof entry.name === "string",
    )
      ? (value as ShippingAddress[])
      : seedAddresses,
);

const selectedStore = new LocalStorageStore<string | null>(
  SELECTED_KEY,
  DEFAULT_SELECTED_ID,
  (value) => (typeof value === "string" ? value : null),
);

/**
 * Saved shipping addresses for the checkout flow, seeded with three demo
 * addresses so the delivery step is interactive immediately. Every address
 * added from checkout or the account hub is persisted and selected.
 */
export function AddressProvider({ children }: { children: ReactNode }) {
  const addresses = useStore(addressesStore);
  const selectedId = useStore(selectedStore);

  const selectAddress = useCallback((id: string) => {
    selectedStore.set(id);
  }, []);

  const addAddress = useCallback(
    (input: Omit<ShippingAddress, "id">): ShippingAddress => {
      const address: ShippingAddress = {
        id: `addr-${Date.now()}`,
        ...input,
      };
      addressesStore.set((prev) => [...prev, address]);
      selectedStore.set(address.id);
      return address;
    },
    [],
  );

  const removeAddress = useCallback((id: string) => {
    addressesStore.set((prev) => prev.filter((address) => address.id !== id));
    selectedStore.set((selected) => (selected === id ? null : selected));
  }, []);

  const value = useMemo<AddressContextValue>(() => {
    const selectedAddress =
      addresses.find((address) => address.id === selectedId) ?? null;
    return {
      addresses,
      selectedAddress,
      selectAddress,
      addAddress,
      removeAddress,
    };
  }, [addresses, selectedId, selectAddress, addAddress, removeAddress]);

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
}

export function useAddresses(): AddressContextValue {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error("useAddresses must be used within an AddressProvider");
  }
  return ctx;
}