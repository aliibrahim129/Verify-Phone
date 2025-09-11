import {
  Card,
  Table,
  Th,
  Td,
  Row,
  Badge,
  Actions,
  ActionBtn,
} from "./ItemTable.styled";

export default function ItemTable({ items, loading, onEdit, onDelete }) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: 200 }}>Name</Th>
            <Th>Description</Th>
            <Th style={{ width: 180 }}>Category</Th>
            <Th style={{ width: 260 }}>Phone</Th>
            <Th style={{ width: 160 }}>Operator</Th>
            <Th style={{ width: 150 }}>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <Td colSpan={5}>Loading...</Td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <Td colSpan={5}>No items yet</Td>
            </tr>
          ) : (
            items.map((it) => (
              <Row key={it._id}>
                <Td>
                  <strong>{it.name}</strong>
                </Td>
                <Td>{it.description || "—"}</Td>
                <Td>
                  {typeof it.categoryId === "object"
                    ? it.categoryId?.name || "—"
                    : "—"}
                </Td>
                <Td>
                  {it.mobileNumber ? (
                    <div>
                      <div>{it.mobileNumber}</div>
                      {it.phoneMeta?.countryCode && (
                        <small style={{ color: "#94a3b8" }}>
                          {it.phoneMeta.countryName} ({it.phoneMeta.countryCode}
                          )
                        </small>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  {it.phoneMeta?.operatorName ? (
                    <Badge>{it.phoneMeta.operatorName}</Badge>
                  ) : (
                    <span style={{ color: "#94a3b8" }}>—</span>
                  )}
                </Td>

                <Td>
                  <Actions>
                    <ActionBtn onClick={() => onEdit(it)}>Edit</ActionBtn>
                    <ActionBtn $variant="danger" onClick={() => onDelete(it)}>
                      Delete
                    </ActionBtn>
                  </Actions>
                </Td>
              </Row>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
}
