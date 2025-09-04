import styled from "styled-components";

export const Shell = styled.div`
min-height: 100vh;
background: #0b0f19;
color: #e6e8ec;
font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans";
`;

export const Container = styled.div`
max-width: 1040px; margin: 0 auto; padding: 32px 20px 64px;
`;

export const Title = styled.h1`
font-size: 28px; margin: 0 0 16px;
`;

export const Sub = styled.p`
color: #a6adbb; margin: 0 0 28px;
`;

export const TopBar = styled.div`
display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
`;

export const PrimaryBtn = styled.button`
background: #4f46e5; color: white; border: 0; padding: 10px 14px; border-radius: 10px; cursor: pointer;
transition: transform 0.06s ease, box-shadow 0.15s ease; box-shadow: 0 6px 14px rgba(79,70,229,0.35);
&:hover { transform: translateY(-1px); }
&:active { transform: translateY(0); }
`;

export const ErrorText = styled.div`
background: #2b1a1a; color: #ffb4b4; border: 1px solid #482222; padding: 10px 12px; border-radius: 10px; margin-bottom: 12px;
`;