import styled from "styled-components";

export const Card = styled.div`
background: #111827; 
border: 1px solid #1f2937; 
border-radius: 14px; 
overflow: hidden;
`;
export const Table = styled.table`
width: 100%; 
border-collapse: collapse;
`;
export const Th = styled.th`
text-align: left; 
font-weight: 600; 
font-size: 14px; 
color: #a6adbb; 
padding: 12px 14px; 
border-bottom: 1px solid #1f2937;
`;
export const Td = styled.td`
padding: 14px; 
border-bottom: 1px solid #1f2937; 
vertical-align: top;
`;
export const Row = styled.tr`
&:hover td { background: #0f172a; }
`;
export const Badge = styled.span`
display: inline-block; 
padding: 4px 8px; 
font-size: 12px; 
border-radius: 999px; 
background: #0b3b2a; 
color: #7cfab3; 
border: 1px solid #0f5136;
`;
export const Actions = styled.div`
display: flex; gap: 8px;
`;
export const ActionBtn = styled.button`
background: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "#334155")}; 
color: white; 
border: 0;
 padding: 8px 12px; 
 border-radius: 8px; 
 cursor: pointer; &:hover { opacity: 0.9; }
`;