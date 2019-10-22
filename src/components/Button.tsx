import classNames from 'classnames';
import React from 'react';

interface Props {
  className?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const Button: React.FunctionComponent<Props> = ({
  className,
  children,
  disabled,
  onClick,
}) => {
  return (
    <button className={classNames('Button', className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
