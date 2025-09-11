import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { listCategories, createCategory } from "../api/categories";
import {
  Overlay,
  Modal,
  Head,
  Body,
  Row,
  Label,
  Input,
  Select,
  Actions,
  Button,
  PhoneRow,
  Alert,
} from "./ItemFormModal.styled";
import { getData } from "country-list";

const schema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().optional(),
  mobileNumber: Yup.string().optional(),
  defaultCountry: Yup.string()
    .matches(/^$|^[A-Z]{2}$/, "Use a 2-letter country code or leave Auto")
    .optional(),
  categoryId: Yup.string()
    .matches(/^$|^[0-9a-fA-F]{24}$/, "Invalid category id")
    .optional(),
});

const ItemFormModal = ({
  initial,
  onClose,
  onSubmit,
  errorText,
  submitting,
}) => {

  const isEdit = !!initial;

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [creatingCategories, setCreatingCategories] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(false);
      const data = await listCategories();
      setCategories(data);

    } catch {
      setCategoriesError(true);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const initialValues = useMemo(
    () => ({
      name: initial?.name || "",
      description: initial?.description || "",
      mobileNumber: initial?.mobileNumber || "",
      defaultCountry: "",
      categoryId:
        (typeof initial?.categoryId === "object"
          ? initial?.categoryId?._id
          : initial?.categoryId) || "",
    }),
    [initial]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values);
    }catch (err) {
      console.error("Submit error:", err);
    }
     finally {
      setSubmitting(false);
    }
  };

    useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Overlay>
      <Modal>
        <Head>
          <div>{isEdit ? "Edit item" : "Add item"}</div>
          <button
            onClick={onClose}
            style={{ background: "transparent", color: "#a6adbb", border: 0, cursor: "pointer" }}
            aria-label="Close"
          >
            ✕
          </button>
        </Head>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Body as={Form}>
              {errorText && <Alert>{errorText}</Alert>}

              <Row>
                <Label>Name</Label>
                <Field name="name" as={Input} placeholder="Item name" autoFocus />
                {touched.name && errors.name && (
                  <small style={{ color: "#ffb4b4" }}>{errors.name}</small>
                )}
              </Row>

              <Row>
                <Label>Description</Label>
                <Field name="description" as={Input} placeholder="Optional" />
              </Row>

              <Row>
                <Label>Phone (optional)</Label>
                <PhoneRow>
                  <Field
                    name="mobileNumber"
                    as={Input}
                    placeholder="e.g. +961 71 234 567 or 03 123 456"
                  />
                  <Field name="defaultCountry" as={Select}>
                    <option value="">Auto</option>
                    {getData()?.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </Field>
                </PhoneRow>
                {touched.defaultCountry && errors.defaultCountry && (
                  <small style={{ color: "#ffb4b4" }}>{errors.defaultCountry}</small>
                )}
                <small style={{ color: "#94a3b8" }}>
                  Tip: choose a country only when typing a local number without “+”. If you already type +961, leave Auto.
                </small>
              </Row>

              <Row>
                <Label>Category</Label>
                <PhoneRow>
                  <Field name="categoryId" as={Select}>
                    <option value="">Unassigned</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>

                  <Button
                    type="button"
                    onClick={async () => {
                      const name = window.prompt("New category name:");
                      if (!name || !name.trim()) return;
                      try {
                        setCreatingCategories(true);
                        await createCategory(name.trim());
                        await fetchCategories(); 
                      } catch (e) {
                        alert(e?.response?.data?.error || e.message);
                      } finally {
                        setCreatingCategories(false);
                      }
                    }}
                    disabled={creatingCategories}
                  >
                    {creatingCategories ? "Adding..." : "+ New"}
                  </Button>
                </PhoneRow>

                {touched.categoryId && errors.categoryId && (
                  <small style={{ color: "#ffb4b4" }}>{errors.categoryId}</small>
                )}
                {categoriesLoading && (
                  <small style={{ color: "#94a3b8" }}>Loading categories…</small>
                )}
                {categoriesError && (
                  <small style={{ color: "#ffb4b4" }}>Failed to load categories</small>
                )}
              </Row>

              <Actions>
                <Button type="button" $variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || submitting}>
                  {isEdit
                    ? isSubmitting || submitting
                      ? "Saving..."
                      : "Save"
                    : isSubmitting || submitting
                    ? "Creating..."
                    : "Create"}
                </Button>
              </Actions>
            </Body>
          )}
        </Formik>
      </Modal>
    </Overlay>
  );
}
export default ItemFormModal;
