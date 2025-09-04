import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { COUNTRIES } from "../utils/countries";
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

const schema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().optional(),
  mobileNumber: Yup.string().optional(),
  // allow empty string (Auto) or a two-letter ISO code
  defaultCountry: Yup.string()
    .matches(/^$|^[A-Z]{2}$/, "Use a 2-letter country code or leave Auto")
    .optional(),
});

export default function ItemFormModal({
  initial,
  onClose,
  onSubmit,
  errorText,
  submitting,
}) {
  const isEdit = !!initial;

  const initialValues = useMemo(
    () => ({
      name: initial?.name || "",
      description: initial?.description || "",
      mobileNumber: initial?.mobileNumber || "",
      defaultCountry: "", // user picks only when typing local format
    }),
    [initial]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Head>
          <div>{isEdit ? "Edit item" : "Add item"}</div>
          <button
            onClick={onClose}
            style={{ background: "transparent", color: "#a6adbb", border: 0, cursor: "pointer" }}
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
                <Field
                  name="name"
                  as={Input}
                  placeholder="Item name"
                  autoFocus
                />
                {touched.name && errors.name && (
                  <small style={{ color: "#ffb4b4" }}>{errors.name}</small>
                )}
              </Row>

              <Row>
                <Label>Description</Label>
                <Field
                  name="description"
                  as={Input}
                  placeholder="Optional"
                />
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
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
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
