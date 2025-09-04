import styled from "styled-components";


export const Overlay = styled.div`
position: fixed; inset: 0; backdrop-filter: blur(2px); background: rgba(0,0,0,0.45);
display: grid; place-items: center; z-index: 50;
`;
export const Modal = styled.div`
background: #0b1220; color: #e6e8ec; border: 1px solid #1e293b; border-radius: 16px;
width: 680px; max-width: calc(100% - 24px); box-shadow: 0 20px 60px rgba(0,0,0,0.6);
`;
export const Head = styled.div`
display: flex; justify-content: space-between; align-items: center;
padding: 16px 18px; border-bottom: 1px solid #1e293b; font-weight: 600;
`;
export const Body = styled.form`
padding: 18px; display: grid; gap: 14px;
`;
export const Row = styled.div`
display: grid; gap: 8px;
`;
export const Label = styled.label`
font-size: 13px; color: #a6adbb;
`;
export const Input = styled.input`
background: #0b1220; color: #e6e8ec; border: 1px solid #334155; border-radius: 10px; padding: 10px 12px; outline: none;
&:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
`;
export const Select = styled.select`
background: #0b1220; color: #e6e8ec; border: 1px solid #334155; border-radius: 10px; padding: 10px 12px; outline: none;
&:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
`;
export const Actions = styled.div`
display: flex; gap: 10px; justify-content: flex-end; padding: 10px 18px 18px;
`;
export const Button = styled.button`
background: ${({ $variant }) => ($variant === "ghost" ? "transparent" : "#4f46e5")};
color: ${({ $variant }) => ($variant === "ghost" ? "#e6e8ec" : "white")};
border: 1px solid ${({ $variant }) => ($variant === "ghost" ? "#334155" : "#4f46e5")};
padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: opacity .15s ease;
&:disabled { opacity: 0.6; cursor: not-allowed; }
`;
export const PhoneRow = styled.div`
display: grid; grid-template-columns: 1fr 170px; gap: 10px;
`;
export const Alert = styled.div`
background: #2b1a1a; color: #ffb4b4; border: 1px solid #482222;
padding: 10px 12px; border-radius: 10px;
`;