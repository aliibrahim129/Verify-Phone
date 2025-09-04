import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listItems, deleteItem, createItem, updateItem } from "../api/items";
import ItemTable from "../ui/ItemTable";
import ItemFormModal from "../ui/ItemFormModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { TopBar, PrimaryBtn, ErrorText } from "./ItemsPage.styled";

export default function ItemsPage() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [modalError, setModalError] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["items"],
    queryFn: listItems,
  });

  const createMut = useMutation({
    mutationFn: createItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
    onError: (err) => console.error("[create] error", err),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateItem({ id, payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
    onError: (err) => console.error("[update] error", err),
  });

  const deleteMut = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
    onError: (err) => console.error("[delete] error", err),
  });

  const onAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const onEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };
  const onDelete = (item) => setConfirm(item);

  const submitForm = async (values) => {
    setModalError("");

    // Build payload: strip empty defaultCountry; send "" to clear mobile
    const payload = { ...values };
    if (payload.defaultCountry === "") delete payload.defaultCountry;
    if (typeof payload.mobileNumber === "string" && payload.mobileNumber.trim() === "") {
      payload.mobileNumber = "";
    }

    if (payload.categoryId === "") delete payload.categoryId;

    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing._id, payload });
      } else {
        await createMut.mutateAsync(payload);
      }
      setFormOpen(false);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Request failed";
      setModalError(msg);
    }
  };

  const confirmDelete = async () => {
    if (!confirm) return;
    await deleteMut.mutateAsync(confirm._id);
    setConfirm(null);
  };

  return (
    <div>
      <TopBar>
        <div />
        <PrimaryBtn onClick={onAdd}>+ Add Item</PrimaryBtn>
      </TopBar>

      {isError && <ErrorText>Error: {error?.message || "Failed to load"}</ErrorText>}

      <ItemTable
        items={data || []}
        loading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {formOpen && (
        <ItemFormModal
          initial={editing}
          onClose={() => {
            setModalError("");
            setFormOpen(false);
          }}
          onSubmit={submitForm}
          errorText={modalError}
          submitting={createMut.isPending || updateMut.isPending}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Delete item?"
          message={`Are you sure you want to delete "${confirm.name}"?`}
          confirmText={deleteMut.isPending ? "Deleting..." : "Delete"}
          onCancel={() => setConfirm(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
