import styled from "styled-components";


export const Overlay = styled.div`
position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: grid; place-items: center; z-index: 60;
`;
export const Box = styled.div`
background: #0b1220; color: #e6e8ec; border: 1px solid #1e293b; border-radius: 14px; width: 420px; max-width: calc(100% - 24px);
`;
export const Head = styled.div`
padding: 14px 16px; border-bottom: 1px solid #1e293b; font-weight: 600;
`;
export const Body = styled.div`
padding: 16px;
`;
export const Actions = styled.div`
display: flex; gap: 10px; justify-content: flex-end; padding: 12px 16px 16px;
`;
export const Button = styled.button`
background: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "transparent")};
color: ${({ $variant }) => ($variant === "danger" ? "white" : "#e6e8ec")};
border: 1px solid #334155; padding: 8px 12px; border-radius: 10px; cursor: pointer;
`;