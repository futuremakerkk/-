
import { useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

export default function PlaceAnalysisDashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const reportRef = useRef(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setReport("");
    try {
      const response = await axios.post("https://your-api-url/analyze", { url });
      setReport(response.data.report);
    } catch (err) {
      setError("분석에 실패했습니다. 링크를 다시 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      html2pdf().from(reportRef.current).save("분석리포트.pdf");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">펜션 플레이스 분석봇</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="네이버 플레이스 URL을 입력하세요"
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading || !url}
      >
        {loading ? "분석 중..." : "분석하기"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {report && (
        <div className="bg-white p-4 border rounded shadow">
          <div ref={reportRef}>
            <h2 className="text-xl font-semibold mb-2">📋 분석 리포트</h2>
            <pre className="whitespace-pre-wrap text-sm">{report}</pre>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            PDF로 저장하기
          </button>
        </div>
      )}
    </div>
  );
}
