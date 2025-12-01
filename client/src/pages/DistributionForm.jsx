import React, { useState, useEffect } from "react";
import axios from "axios";


const DistributionForm = () => {
  const [zones, setZones] = useState([]);
  const [centers, setCenters] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [distributionDate, setDistributionDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ Resource_ID: "", Quantity: 0 }]);

  useEffect(() => {
    axios.get("http://localhost:8800/disasterzone").then(res => setZones(res.data));
    axios.get("http://localhost:8800/reliefcenter").then(res => setCenters(res.data));
    axios.get("http://localhost:8800/resource").then(res => setResources(res.data));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { Resource_ID: "", Quantity: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const distRes = await axios.post("http://localhost:8800/distribution", {
        Center_ID: selectedCenter,
        Zone_ID: selectedZone,
        Distribution_Date: distributionDate
      });
      const distributionId = distRes.data.Distribution_ID;

      const distItems = items
        .filter(i => i.Resource_ID && i.Quantity > 0)
        .map(i => ({
          Distribution_ID: distributionId,
          Resource_ID: i.Resource_ID,
          Quantity: parseInt(i.Quantity)
        }));

      if (distItems.length) {
        await axios.post("http://localhost:8800/distributionitem", { items: distItems });
      }

      alert("Distribution sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send distribution");
    }
  };

  return (
    <div className="distribution-container">
      <h2>📦 Send Donations to Disaster Zone</h2>
      <form className="distribution-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Disaster Zone</label>
          <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} required>
            <option value="">Select Zone</option>
            {zones.map(z => (
              <option key={z.Zone_ID} value={z.Zone_ID}>{z.Name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Relief Center</label>
          <select value={selectedCenter} onChange={e => setSelectedCenter(e.target.value)} required>
            <option value="">Select Center</option>
            {centers.map(c => (
              <option key={c.Center_ID} value={c.Center_ID}>{c.Name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Distribution Date</label>
          <input type="date" value={distributionDate} onChange={e => setDistributionDate(e.target.value)} required />
        </div>

        <h3>🛠️ Resources to Send:</h3>
        {items.map((item, idx) => (
          <div className="resource-row" key={idx}>
            <select
              value={item.Resource_ID}
              onChange={e => handleItemChange(idx, "Resource_ID", e.target.value)}
              required
            >
              <option value="">Select Resource</option>
              {resources.map(r => (
                <option key={r.Resource_ID} value={r.Resource_ID}>{r.Resource_Type}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.Quantity}
              onChange={e => handleItemChange(idx, "Quantity", e.target.value)}
              required
              placeholder="Quantity"
            />
            <button type="button" className="remove-btn" onClick={() => removeItem(idx)}>❌</button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addItem}>➕ Add Resource</button>

        <div className="submit-wrapper">
          <button type="submit" className="submit-btn">🚚 Send Distribution</button>
        </div>
      </form>
    </div>
  );
};

export default DistributionForm;
