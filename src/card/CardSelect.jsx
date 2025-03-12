import { useState } from "react";
import { fetchMetadata } from "./CardService";

const NFTViewer = () => {
  const [tokenId, setTokenId] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mock-container">
      <h1>NFT 조회</h1>
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button
        onClick={() =>
          fetchMetadata(tokenId, setMetadata, setMetadataUrl, setLoading)
        }
        disabled={loading}
      >
        {loading ? "조회 중..." : "NFT 조회"}
      </button>

      {metadata && (
        <img src={metadata.image} alt="NFT 이미지" style={{ width: "300px" }} />
      )}
    </div>
  );
};

export default NFTViewer;
