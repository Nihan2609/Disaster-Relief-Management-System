import express from "express";
import mysql from "mysql2";
import cors from "cors";


// ============ App Initialization ============
const app = express();
app.use(express.json());
app.use(cors());

// ============ MySQL DB Connection ============
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "212001",
  database: "disaster_relief_management"
});

// ============ AUTH ROUTES ============
// Admin / Volunteer / Donor Login
// ============ AUTH ROUTES ============

app.post("/login", (req, res) => {
  const { email, password } = req.body;


  if (email === "admin@gmail.com" && password === "admin123") {
    return res.status(200).json({ message: "Admin login successful", id: 0, role: "admin" });
  }

 
  const volunteerQuery = "SELECT Volunteer_ID, Name FROM Volunteer WHERE Email = ? AND Password = ?";
  db.query(volunteerQuery, [email, password], (err, volData) => {
    if (err) return res.status(500).json("DB error");
    if (volData.length > 0) {
      return res.status(200).json({ message: "Volunteer login successful", id: volData[0].Volunteer_ID, role: "volunteer", name: volData[0].Name });
    }

    
    const donorQuery = "SELECT Donor_ID, Name FROM Donor WHERE Email = ? AND Password = ?";
    db.query(donorQuery, [email, password], (err, donorData) => {
      if (err) return res.status(500).json("DB error");
      if (donorData.length > 0) {
        return res.status(200).json({ message: "Donor login successful", id: donorData[0].Donor_ID, role: "donor", name: donorData[0].Name });
      }

      
      return res.status(401).json("Invalid credentials");
    });
  });
});


// Registration
// Volunteer Registration
app.post("/register/volunteer", (req, res) => {
  const { name, contact, email, password, skill,address } = req.body;
  const q = "INSERT INTO Volunteer (Name, Contact_Info, Email, Password, Skill,address) VALUES (?, ?, ?, ?, ?,?)";
  db.query(q, [name, contact, email, password, skill,address], (err) => {
    if (err) return res.status(500).json("Volunteer registration failed");
    return res.status(201).json("Volunteer registered");
  });
});

// Donor Registration
app.post("/register/donor", (req, res) => {
  const { name, contact, email, password, isAnonymous } = req.body;
  const q = "INSERT INTO Donor (Name, Contact_Info, Email, Password, Is_Anonymous) VALUES (?, ?, ?, ?, ?)";
  db.query(q, [name, contact, email, password, isAnonymous || false], (err) => {
    if (err) return res.status(500).json("Donor registration failed");
    return res.status(201).json("Donor registered");
  });
});


// ============ DISASTER ZONE ROUTES ============
app.get("/disasterzone", (req, res) => {
  const q = "SELECT Zone_ID, Name, Disaster_Status, DATE_FORMAT(Last_Update, '%Y-%m-%d') AS Last_Update FROM DisasterZone";
  db.query(q, (err, data) => err ? res.status(500).json(err) : res.json(data));
});

app.post("/disasterzone", (req, res) => {
  const q = "INSERT INTO DisasterZone (Name, Disaster_Status, Last_Update) VALUES (?)";
  const values = [req.body.Name, req.body.Disaster_status, req.body.Last_update || new Date()];
  db.query(q, [values], (err) => err ? res.status(500).json(err) : res.status(201).json("Disaster zone created"));
});

app.put("/disasterzone/:id", (req, res) => {
  const q = "UPDATE DisasterZone SET Name = ?, Disaster_status = ?, Last_update = ? WHERE Zone_ID = ?";
  const values = [req.body.Name, req.body.Disaster_status, req.body.Last_update || new Date(), req.params.id];
  db.query(q, values, (err) => err ? res.status(500).json(err) : res.status(200).json("Disaster zone updated"));
});

app.delete("/disasterzone/:id", (req, res) => {
  db.query("DELETE FROM DisasterZone WHERE Zone_ID = ?", [req.params.id], (err) =>
    err ? res.status(500).json(err) : res.status(200).json("Disaster zone deleted"));
});


app.get("/disasterzone/:id", (req, res) => {
  const zoneId = req.params.id;
  const q = "SELECT * FROM DisasterZone WHERE Zone_ID = ?";

  db.query(q, [zoneId], (err, data) => {
    if (err) return res.status(500).json("Error fetching zone: " + err);
    if (data.length === 0) return res.status(404).json("Zone not found");
    res.json(data[0]);
  });
});



// ============ VOLUNTEER ROUTES ============
app.get("/volunteer", (_, res) => {
  db.query("SELECT * FROM Volunteer", (err, data) =>
    err ? res.status(500).json(err) : res.json(data)
  );
});

app.get("/volunteer/:id", (req, res) => {
  db.query("SELECT * FROM Volunteer WHERE Volunteer_ID = ?", [req.params.id], (err, data) =>
    err ? res.status(500).json(err) :
      data.length ? res.status(200).json(data[0]) : res.status(404).json("Volunteer not found")
  );
});

app.post("/volunteer", (req, res) => {
  const values = [req.body.Name, req.body.Contact_Info, req.body.Skill];
  db.query("INSERT INTO Volunteer (Name, Contact_Info, Skill) VALUES (?)", [values], (err) =>
    err ? res.status(500).json(err) : res.status(201).json("Volunteer added")
  );
});

app.put("/volunteer/:id", (req, res) => {
  const { Name, Contact_Info, Skill } = req.body;
  db.query(
    "UPDATE Volunteer SET Name = ?, Contact_Info = ?, Skill = ? WHERE Volunteer_ID = ?",
    [Name, Contact_Info, Skill, req.params.id],
    (err) => err ? res.status(500).json(err) : res.json("Volunteer updated")
  );
});

app.delete("/volunteer/:id", (req, res) => {
  db.query("DELETE FROM Volunteer WHERE Volunteer_ID = ?", [req.params.id], (err) =>
    err ? res.status(500).json(err) : res.json("Volunteer deleted")
  );
});


app.get("/volunteering/volunteer/:volunteerId", (req, res) => {
  const volunteerId = req.params.volunteerId;
  const q = `
    SELECT Zone_ID 
    FROM Volunteering 
    WHERE Volunteer_ID = ?
  `;

  db.query(q, [volunteerId], (err, data) => {
    if (err) {
      return res.status(500).json("Error fetching volunteering data: " + err);
    }
    res.json(data);
  });
});


app.delete("/volunteering", (req, res) => {
  const { Volunteer_ID, Zone_ID } = req.body;

  const q = "DELETE FROM Volunteering WHERE Volunteer_ID = ? AND Zone_ID = ?";
  db.query(q, [Volunteer_ID, Zone_ID], (err, data) => {
    if (err) {
      console.error("Failed to delete assignment:", err);
      return res.status(500).json("Failed to delete assignment");
    }
    return res.status(200).json("Assignment deleted successfully");
  });
});


// ============ REQUEST ROUTES ============
app.get("/request", (_, res) => {
  db.query("SELECT * FROM Request", (err, data) => err ? res.status(500).json(err) : res.json(data));
});

app.post("/request", (req, res) => {
  const values = [req.body.Zone_ID, req.body.Req_Status, req.body.Urgency];
  db.query("INSERT INTO Request (Zone_ID, Req_Status, Urgency) VALUES (?)", [values], (err) =>
    err ? res.status(500).json(err) : res.status(201).json("Request created"));
});

app.delete("/request/:id", (req, res) => {
  db.query("DELETE FROM Request WHERE Request_ID = ?", [req.params.id], (err) =>
    err ? res.status(500).json(err) : res.json("Request deleted"));
});


// ============ RESOURCE ROUTES ============
app.get("/resource", (_, res) => {
  db.query("SELECT * FROM Resource", (err, data) => err ? res.status(500).json(err) : res.json(data));
});

app.post("/resource", (req, res) => {
  const values = [req.body.Resource_Type, req.body.Unit, req.body.Description];
  db.query(
    "INSERT INTO Resource (Resource_Type, Unit, Description) VALUES (?, ?, ?)",
    values,
    (err) => err ? res.status(500).json(err) : res.status(201).json("Resource added")
  );
});

app.delete("/resource/:id", (req, res) => {
  db.query("DELETE FROM Resource WHERE Resource_ID = ?", [req.params.id], (err) =>
    err ? res.status(500).json(err) : res.json("Resource deleted"));
});

app.get("/zone/:id/resources", (req, res) => {
  const zoneId = req.params.id;

  const q = `
    SELECT r.Resource_ID, r.Resource_Type, r.Unit, ri.Quantity
    FROM Distribution d
    JOIN DistributionItem ri ON d.Distribution_ID = ri.Distribution_ID
    JOIN Resource r ON ri.Resource_ID = r.Resource_ID
    WHERE d.Zone_ID = ?
  `;

  db.query(q, [zoneId], (err, data) => {
    if (err) return res.status(500).json("Error fetching zone resources: " + err);
    res.json(data);
  });
});



// ============ DONOR & DONATION ROUTES ============
app.get("/donor/:id", (req, res) => {
  db.query("SELECT * FROM Donor WHERE Donor_ID = ?", [req.params.id], (err, data) =>
    err ? res.status(500).json(err) :
      data.length ? res.json(data[0]) : res.status(404).json("Donor not found"));
});

app.put("/donor/:id", (req, res) => {
  const { Name, Contact_Info, Is_Anonymous } = req.body;
  db.query("UPDATE Donor SET Name = ?, Contact_Info = ?, Is_Anonymous = ? WHERE Donor_ID = ?",
    [Name, Contact_Info, Is_Anonymous, req.params.id], (err) =>
    err ? res.status(500).json("Update failed") : res.json("Donor updated"));
});

app.post("/donation", (req, res) => {
  const { Donor_ID, Resource_ID, Quantity } = req.body;
  const q = "INSERT INTO Donation (Donor_ID, Resource_ID, Quantity, Donation_Date) VALUES (?, ?, ?, NOW())";
  db.query(q, [Donor_ID, Resource_ID, Quantity], (err) =>
    err ? res.status(500).json("Donation failed") : res.status(201).json("Donation recorded"));
});

app.get("/donor/:id/donations", (req, res) => {
  const q = `
    SELECT d.Donation_ID, d.Quantity, d.Donation_Date, 
           r.Resource_Type, r.Unit, r.Description
    FROM Donation d
    LEFT JOIN Resource r ON d.Resource_ID = r.Resource_ID
    WHERE d.Donor_ID = ?`;
  db.query(q, [req.params.id], (err, data) =>
    err ? res.status(500).json("Failed to fetch donations") : res.json(data));
});

app.get("/donation", (req, res) => {
  const q = `
    SELECT d.Donation_ID, d.Quantity, d.Donation_Date,
           dr.Name AS Donor_Name, dr.Contact_Info,
           r.Resource_Type
    FROM Donation d
    JOIN Donor dr ON d.Donor_ID = dr.Donor_ID
    JOIN Resource r ON d.Resource_ID = r.Resource_ID
    ORDER BY d.Donation_Date DESC
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Error fetching donations: " + err);
    return res.status(200).json(data);
  });
});



//  ASSIGNMENT ROUTES 
app.put("/volunteer/:id/assign-zone", (req, res) => {
  const { Zone_ID } = req.body;
  const sql = "INSERT INTO Volunteering (Volunteer_ID, Zone_ID) VALUES (?, ?)";
  db.query(sql, [req.params.id, Zone_ID], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json("Already assigned");
      return res.status(500).json("Assignment failed");
    }
    res.json("Volunteer assigned");
  });
});

app.get("/assignments", (_, res) => {
  const q = `
    SELECT v.Volunteer_ID, v.Name AS Volunteer_Name, v.Skill, v.Contact_Info,
           z.Zone_ID, z.Name AS Zone_Name, z.Disaster_Status
    FROM Volunteering vt
    JOIN Volunteer v ON vt.Volunteer_ID = v.Volunteer_ID
    JOIN DisasterZone z ON vt.Zone_ID = z.Zone_ID
    ORDER BY z.Zone_ID, v.Volunteer_ID`;
  db.query(q, (err, data) => err ? res.status(500).json("Failed") : res.json(data));
});


// ============ ZONE TYPE & SEVERITY ROUTES ============
app.post("/zone/assign-type", (req, res) => {
  const { zoneId, disasterTypeIds } = req.body;
  const deleteQ = "DELETE FROM ZoneDisasterType WHERE Zone_ID = ?";
  const insertQ = "INSERT INTO ZoneDisasterType (Zone_ID, Type_ID) VALUES ?";

  db.query(deleteQ, [zoneId], (err) => {
    if (err) return res.status(500).json("Failed to clear old types");
    const values = disasterTypeIds.map(id => [zoneId, id]);
    db.query(insertQ, [values], (err2) =>
      err2 ? res.status(500).json("Failed to assign new types") : res.json("Types updated"));
  });
});

app.post("/zone/assign-severity", (req, res) => {
  const { zoneId, severityId } = req.body;
  const q = `
    INSERT INTO ZoneSeverity (Zone_ID, Severity_ID)
    VALUES (?, ?) ON DUPLICATE KEY UPDATE Severity_ID = VALUES(Severity_ID)`;
  db.query(q, [zoneId, severityId], (err) =>
    err ? res.status(500).json("Severity update failed") : res.json("Severity updated"));
});

app.get("/disastertype", (_, res) => {
  db.query("SELECT * FROM DisasterType", (err, data) =>
    err ? res.status(500).json("Failed") : res.json(data));
});

app.get("/severitylevel", (_, res) => {
  db.query("SELECT * FROM SeverityLevel", (err, data) =>
    err ? res.status(500).json("Failed") : res.json(data));
});



// ============ RELIEF CENTER ROUTES ============
app.get("/reliefcenters", (_, res) => {
  db.query("SELECT * FROM ReliefCenter", (err, data) =>
    err ? res.status(500).json("Failed") : res.json(data));
});

app.post("/reliefcenters", (req, res) => {
  const { Name, Contact_Info, Location, Capacity } = req.body;
  db.query("INSERT INTO ReliefCenter (Name, Contact_Info, Location, Capacity) VALUES (?, ?, ?, ?)",
    [Name, Contact_Info, Location, Capacity], (err) =>
    err ? res.status(500).json("Insert failed") : res.status(201).json("Relief center added"));
});

app.put("/reliefcenters/:id", (req, res) => {
  const { Name, Contact_Info, Location, Capacity } = req.body;
  db.query("UPDATE ReliefCenter SET Name = ?, Contact_Info = ?, Location = ?, Capacity = ? WHERE Center_ID = ?",
    [Name, Contact_Info, Location, Capacity, req.params.id], (err) =>
    err ? res.status(500).json("Update failed") : res.json("Relief center updated"));
});

app.delete("/reliefcenters/:id", (req, res) => {
  db.query("DELETE FROM ReliefCenter WHERE Center_ID = ?", [req.params.id], (err) =>
    err ? res.status(500).json("Delete failed") : res.json("Relief center deleted"));
});

app.post("/reliefcenters", (req, res) => {
  const { Name, Contact_Info, Location, Capacity } = req.body;
  if (!Name || !Contact_Info || !Location || !Capacity) {
    return res.status(400).json("Missing fields");
  }
  db.query("INSERT INTO ReliefCenter (Name, Contact_Info, Location, Capacity) VALUES (?, ?, ?, ?)",
    [Name, Contact_Info, Location, Capacity], (err) =>
    err ? res.status(500).json("Insert failed") : res.status(201).json("Relief center added"));
});



app.get("/zone-info", (_, res) => {
  const q = `
    SELECT dz.Zone_ID, dz.Name AS Zone_Name, dz.Disaster_Status,
           DATE_FORMAT(dz.Last_Update, '%Y-%m-%d') AS Last_Updated,
           GROUP_CONCAT(DISTINCT dt.Type_Name SEPARATOR ', ') AS Disaster_Types,
           sl.Level AS Severity_Level
    FROM DisasterZone dz
    LEFT JOIN ZoneDisasterType zdt ON dz.Zone_ID = zdt.Zone_ID
    LEFT JOIN DisasterType dt ON zdt.Type_ID = dt.Type_ID
    LEFT JOIN ZoneSeverity zs ON dz.Zone_ID = zs.Zone_ID
    LEFT JOIN SeverityLevel sl ON zs.Severity_ID = sl.Severity_ID
    GROUP BY dz.Zone_ID, dz.Name, dz.Disaster_Status, dz.Last_Update, sl.Level
    ORDER BY dz.Zone_ID`;
  db.query(q, (err, data) => err ? res.status(500).json("Failed") : res.json(data));
});


app.post("/distribution", (req, res) => {
  const { Center_ID, Zone_ID, Distribution_Date } = req.body;
  const q = `INSERT INTO Distribution (Center_ID, Zone_ID, Distribution_Date) VALUES (?, ?, ?)`;
  db.query(q, [Center_ID, Zone_ID, Distribution_Date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ Distribution_ID: result.insertId });
  });
});


app.post("/distributionitem", (req, res) => {

  const items = req.body.items;
  if (!items || !items.length) return res.status(400).json("No items provided");

  const values = items.map(i => [i.Distribution_ID, i.Resource_ID, i.Quantity]);
  const q = `INSERT INTO DistributionItem (Distribution_ID, Resource_ID, Quantity) VALUES ?`;
  db.query(q, [values], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json("Distribution items added");
  });
});


app.get("/reliefcenter", (req, res) => {
  db.query("SELECT * FROM ReliefCenter", (err, data) => {
    if (err) {
      return res.status(500).json("Database error: " + err);
    }
    res.status(200).json(data);
  });
});




app.get("/zone-info", (req, res) => {
  const query = `
    SELECT 
      dz.Zone_ID, 
      dz.Name AS Zone_Name, 
      dz.Last_Update AS Last_Updated, 
      GROUP_CONCAT(DISTINCT dt.Type_Name SEPARATOR ', ') AS Disaster_Types, 
      sl.Level AS Severity_Level 
    FROM DisasterZone dz 
    LEFT JOIN ZoneDisasterType zdt ON dz.Zone_ID = zdt.Zone_ID 
    LEFT JOIN DisasterType dt ON zdt.Type_ID = dt.Type_ID 
    LEFT JOIN ZoneSeverity zs ON dz.Zone_ID = zs.Zone_ID 
    LEFT JOIN SeverityLevel sl ON zs.Severity_ID = sl.Severity_ID 
    GROUP BY dz.Zone_ID 
    ORDER BY dz.Last_Update DESC;
  `;

  db.query(query, (err, data) => {
    if (err) return res.status(500).json("Database error: " + err);
    res.json(data);
  });
});


app.get("/zone/unassigned", (req, res) => {
  const query = `
    SELECT dz.Zone_ID, dz.Name 
    FROM DisasterZone dz 
    LEFT JOIN ZoneDisasterType zdt ON dz.Zone_ID = zdt.Zone_ID 
    LEFT JOIN ZoneSeverity zs ON dz.Zone_ID = zs.Zone_ID 
    WHERE zdt.Type_ID IS NULL OR zs.Severity_ID IS NULL 
    GROUP BY dz.Zone_ID;
  `;

  db.query(query, (err, data) => {
    if (err) return res.status(500).json("Error fetching unassigned zones: " + err);
    res.json(data);
  });
});


app.get("/disastertype", (req, res) => {
  db.query("SELECT * FROM DisasterType", (err, data) => {
    if (err) return res.status(500).json("Error loading types: " + err);
    res.json(data);
  });
});


app.get("/severitylevel", (req, res) => {
  db.query("SELECT * FROM SeverityLevel", (err, data) => {
    if (err) return res.status(500).json("Error loading severity levels: " + err);
    res.json(data);
  });
});


app.post("/zone/assign-type", (req, res) => {
  const { zoneId, disasterTypeIds } = req.body;

  if (!zoneId || !Array.isArray(disasterTypeIds) || disasterTypeIds.length === 0) {
    return res.status(400).json("Zone ID and disaster types are required.");
  }

  const values = disasterTypeIds.map((typeId) => [zoneId, typeId]);

  const insertQuery = `
    INSERT IGNORE INTO ZoneDisasterType (Zone_ID, Type_ID) VALUES ?;
  `;

  db.query(insertQuery, [values], (err, result) => {
    if (err) return res.status(500).json("Error assigning types: " + err);
    res.json("Disaster types assigned to zone.");
  });
});


app.post("/zone/assign-severity", (req, res) => {
  const { zoneId, severityId } = req.body;

  if (!zoneId || !severityId) {
    return res.status(400).json("Zone ID and severity level are required.");
  }

  const insertQuery = `
    INSERT INTO ZoneSeverity (Zone_ID, Severity_ID)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE Severity_ID = VALUES(Severity_ID);
  `;

  db.query(insertQuery, [zoneId, severityId], (err, result) => {
    if (err) return res.status(500).json("Error assigning severity: " + err);
    res.json("Severity level assigned to zone.");
  });
});


app.get("/zones/assigned", (req, res) => {
  const query = `
    SELECT DISTINCT dz.Zone_ID
    FROM DisasterZone dz
    INNER JOIN ZoneDisasterType zdt ON dz.Zone_ID = zdt.Zone_ID
    INNER JOIN ZoneSeverity zs ON dz.Zone_ID = zs.Zone_ID
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json("Error fetching assigned zones: " + err);
    }
    res.json(data);
  });
});



// -------------------- REPORT ROUTES --------------------

// Create a new report
app.post("/reports", (req, res) => {
  const {
    donorId,
    volunteerId,
    zoneId,
    title,
    description,
    type,
    district,
    deaths,
    casualties,
    severity
  } = req.body;

  const q = `
    INSERT INTO Reports 
      (Donor_ID, Volunteer_ID, Zone_ID, Title, Description, Type, District, Deaths, Casualties, Severity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    q,
    [
      donorId || null,
      volunteerId || null,
      zoneId || null,
      title,
      description,
      type || null,
      district || null,
      deaths || 0,
      casualties || 0,
      severity || "Low"
    ],
    (err) => {
      if (err) return res.status(500).json("Failed to submit report: " + err);
      res.status(201).json("Report submitted successfully");
    }
  );
});

// Get all reports
app.get("/reports", (_, res) => {
  const q = `
    SELECT r.*, 
           dz.Name AS Zone_Name, 
           d.Name AS Donor_Name, 
           v.Name AS Volunteer_Name
    FROM Reports r
    LEFT JOIN DisasterZone dz ON r.Zone_ID = dz.Zone_ID
    LEFT JOIN Donor d ON r.Donor_ID = d.Donor_ID
    LEFT JOIN Volunteer v ON r.Volunteer_ID = v.Volunteer_ID
    ORDER BY r.Created_At DESC
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Failed to fetch reports: " + err);
    res.json(data);
  });
});

// Update report (status or any other field)
app.put("/reports/:id", (req, res) => {
  const reportId = req.params.id;
  const {
    status,
    type,
    district,
    deaths,
    casualties,
    severity,
    resolvedAt
  } = req.body;

  const q = `
    UPDATE Reports SET 
      Status = ?, 
      Type = ?, 
      District = ?, 
      Deaths = ?, 
      Casualties = ?, 
      Severity = ?, 
      Resolved_At = ?
    WHERE Report_ID = ?
  `;

  db.query(
    q,
    [
      status || "pending",
      type || null,
      district || null,
      deaths || 0,
      casualties || 0,
      severity || "Low",
      resolvedAt || null,
      reportId
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Report not found" });

      // Fetch updated report
      db.query("SELECT * FROM Reports WHERE Report_ID = ?", [reportId], (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to fetch updated report" });
        res.json(data[0]);
      });
    }
  );
});

// Delete report
app.delete("/reports/:id", (req, res) => {
  const reportId = req.params.id;
  db.query("DELETE FROM Reports WHERE Report_ID = ?", [reportId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Report not found" });
    }
    return res.status(200).json({ message: "Report deleted successfully" });
  });
});





// ============ SERVER START ============
app.listen(8800, () => {
  console.log("✅ Server is running on port 8800");
});
