import React from "react";
import {
  Overlay as COverlay,
  Box,
  Head as CHead,
  Body as CBody,
  Actions as CActions,
  Button as CButton,
} from "./ConfirmDialog.styled";

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  onCancel,
  onConfirm,
}) {
  return (
    <COverlay>
      <Box>
        <CHead>{title}</CHead>
        <CBody>{message}</CBody>
        <CActions>
          <CButton onClick={onCancel}>Cancel</CButton>
          <CButton $variant="danger" onClick={onConfirm}>
            {confirmText}
          </CButton>
        </CActions>
      </Box>
    </COverlay>
  );
}
