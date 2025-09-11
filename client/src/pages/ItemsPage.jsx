import React, { useEffect, useState, useCallback } from "react";
import { listItems, deleteItem, createItem, updateItem } from "../api/items";
import ItemTable from "../ui/ItemTable";
import ItemFormModal from "../ui/ItemFormModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { TopBar, PrimaryBtn, ErrorText } from "./ItemsPage.styled";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [modalError, setModalError] = useState("");

  const [saving, setSaving] = useState(false);          
  const [deletingId, setDeletingId] = useState(null);   

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await listItems();
      setItems(data);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Failed to load";
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

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
    setSaving(true);

    const payload = { ...values };
    if (payload.defaultCountry === "") delete payload.defaultCountry;
    if (typeof payload.mobileNumber === "string" && payload.mobileNumber.trim() === "") {
      payload.mobileNumber = ""; 
    }
    if (payload.categoryId === "") delete payload.categoryId;

    try {
      if (editing) {
        await updateItem({ id: editing._id, payload });
      } else {
        await createItem(payload);
      }
      setFormOpen(false);
      await fetchItems(); 
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Request failed"; 
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirm) return;
    try {
      setDeletingId(confirm._id);
      await deleteItem(confirm._id);
      setConfirm(null);
      await fetchItems(); 
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Delete failed";
      setLoadError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div>
      <TopBar>
        <div />
        <PrimaryBtn onClick={onAdd}>+ Add Item</PrimaryBtn>
      </TopBar>

      {loadError && <ErrorText>Error: {loadError}</ErrorText>}

      <ItemTable
        items={items}
        loading={loading}
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
          submitting={saving}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Delete item?"
          message={`Are you sure you want to delete "${confirm.name}"?`}
          confirmText={deletingId === confirm._id ? "Deleting..." : "Delete"}
          onCancel={() => setConfirm(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default ItemsPage;
