import React from 'react';
import styled from 'styled-components';

const TextInput = ({ onValueChange, rightAddon, ...props }: {
  onValueChange: (value: string) => void;
  rightAddon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Wrapper>
      <StyledTextInput
        type="text"
        onChange={(e) => onValueChange(e?.target?.value ?? '')}
        {...props}
      />
      {rightAddon}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 8px 8px 8px 13px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.background.input};
  color: ${({ theme }) => theme.color.text.input};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;
  height: 46px;
  width: 100%;
  gap: 10px;
`;

const StyledTextInput = styled.input`
  background: transparent;
  color: ${({ theme }) => theme.color.text.input};
  border: none;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.text.inputInactive};
  }

`;

export default TextInput;
