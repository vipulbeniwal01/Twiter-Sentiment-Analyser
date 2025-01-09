import { useState, useEffect } from "react";

export function TokenList() {
  const [createdTokens, setCreatedTokens] = useState([]);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("createdTokens")) || [];
    setCreatedTokens(tokens);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-2xl border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">Created Tokens</h1>
        {createdTokens.length === 0 ? (
          <p className="text-gray-400">No tokens created yet.</p>
        ) : (
          <ul className="space-y-4">
            {createdTokens.map((token, index) => (
              <li key={index} className="p-4 border border-gray-700 rounded-md shadow-sm bg-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">{token.name} ({token.symbol})</h3>
                <p className="text-sm text-gray-300">Mint Address: {token.mintAddress}</p>
                {token.imageUrl && (
                  <img
                    src={token.imageUrl}
                    alt={token.name}
                    className="mt-2 w-16 h-16 object-cover rounded-md"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}