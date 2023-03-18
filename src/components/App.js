import "./App.css";
import { useState } from "react";
import { create } from "ipfs-http-client";

const client = create({
  url: "http://localhost:5001",
});

const App = () => {
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(new Uint8Array(reader.result));
    };

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.log("Please select a file.");
      return;
    }

    try {
      const created = await client.add(file);
      const cid = created.cid.toString();
      const url = `http://localhost:8080/ipfs/${cid}?filename=${cid}`;
      setUrlArr((prev) => [...prev, url]);
      console.log(urlArr);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">IPFS Project</header>

      <div className="main">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>

      <div className="display">
        {urlArr.length !== 0
          ? urlArr.map((url, index) => <img key={index} src={url} alt="nfts" />)
          : <h3>Upload data</h3>}
      </div>
    </div>
  );
};

export default App;
