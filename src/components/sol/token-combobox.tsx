import { PublicKey } from "@solana/web3.js";

type TokenComboboxProps = {
  tokens: PublicKey[];
};

const TokenCombobox = ({ tokens }: TokenComboboxProps) => {
  console.log(tokens);
  return <div>TokenCombobox</div>;
};

export { TokenCombobox };
