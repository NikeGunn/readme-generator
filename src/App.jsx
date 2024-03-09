// Import necessary dependencies from Material-UI
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
} from "@mui/material";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    skills: "",
    projects: "",
    contributions: "",
    username: "",
    bannerImage: "",
    gifURL: "",
    details: "",
  });

  const [githubStats, setGithubStats] = useState({
    stars: 0,
    languages: [],
  });

  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch(
          `https://api.github.com/users/${userData.username}`
        );
        const userData = await userResponse.json();
        setGithubStats((prevStats) => ({
          ...prevStats,
          stars: userData.public_repos,
        }));

        const reposResponse = await fetch(
          `https://api.github.com/users/${userData.username}/repos?per_page=100`
        );
        const reposData = await reposResponse.json();
        const languages = reposData.reduce((acc, repo) => {
          if (repo.language) {
            acc[repo.language] = acc[repo.language]
              ? acc[repo.language] + 1
              : 1;
          }
          return acc;
        }, {});
        const sortedLanguages = Object.keys(languages).sort(
          (a, b) => languages[b] - languages[a]
        );
        setGithubStats((prevStats) => ({
          ...prevStats,
          languages: sortedLanguages,
        }));
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    if (userData.username) {
      fetchGitHubData();
    }
  }, [userData.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));

    if (!selectedFields.includes(name)) {
      setSelectedFields((prevSelected) => [...prevSelected, name]);
    }
  };

  const generateReadme = () => {
    // If fewer than 5 fields are selected, do not proceed
    if (selectedFields.length < 5) {
      return;
    }
    // Create your README content using userData and githubStats
    const readmeContent =
      `![Banner Image](${userData.bannerImage})\n\n` +
      `<h1 align="center"> Hi 👋, I'm ${userData.name} </h1>\n\n` +
      `<h3 align="center">\n\n${userData.bio}</h3>\n\n` +
      `  <div style="flex: 1;">\n` +
      `    \n\n<img  align="right" alt="coding" width="400" src="${userData.gifURL}" />\n\n` +
      `  </div>\n` +
      `  <p align="left">\n` +
      `    \n\n${userData.details}\n\n` +
      `  </p>\n` +
      `<h3>Skills\n\n${userData.skills}</h3>\n\n` +
      `<h5> Projects\n\n${userData.projects}</h5>` +
      `<h5>Contributions\n\n${userData.contributions}</h5>\n\n` +
      `## GitHub Stats\n\n![${userData.username}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${userData.username}&show_icons=true&count_private=true&hide=contribs,prs)\n\n` +
      `Total GitHub Stars: ${githubStats.stars || "N/A"}\n\n` +
      `## Most Used Languages\n\n${githubStats.languages
        .map(
          (language) =>
            `![${language}](https://img.shields.io/badge/${encodeURIComponent(
              language
            )}-%23000.svg?&style=for-the-badge&logo=${encodeURIComponent(
              language
            )}&logoColor=white)`
        )
        .join("\n")}\n\n` +
      `## Connect with Me\n\n[LinkedIn](https://www.linkedin.com/in/${userData.username}) | [Twitter](https://twitter.com/${userData.username}) | [Personal Website](https://www.yourwebsite.com)\n\n` +
      `Feel free to explore my repositories and get in touch for collaboration or discussions.\n\nHappy coding! 🚀`;

    // Create a Blob and initiate download
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset the state after download
    setUserData({
      name: "",
      bio: "",
      skills: "",
      projects: "",
      contributions: "",
      username: "",
      bannerImage: "",
      gifURL: "",
      details: "",
    });
    setSelectedFields([]);
  };

  return (
    <Container
      maxWidth="md"
      className="mt-8 p-8 bg-gray-100 rounded-lg shadow-lg"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <GitHubIcon style={{ marginRight: "8px", fontSize: 60 }} />
        <Typography mt={2} variant="h3" component="h1" gutterBottom>
          GitHub Readme Generator
        </Typography>
      </div>
      <Grid container spacing={3}>
        {/* Input Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="GitHub Username"
            fullWidth
            variant="outlined"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Banner Image URL"
            fullWidth
            variant="outlined"
            name="bannerImage"
            value={userData.bannerImage}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="GIF URL"
            fullWidth
            variant="outlined"
            name="gifURL"
            value={userData.gifURL}
            onChange={handleChange}
          />
        </Grid>

        {/* Textarea Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Bio"
            fullWidth
            variant="outlined"
            name="bio"
            value={userData.bio}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Skills"
            fullWidth
            variant="outlined"
            name="skills"
            value={userData.skills}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Projects (URLs) | You can find all my projects here"
            fullWidth
            variant="outlined"
            name="projects"
            value={userData.projects}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contributions"
            fullWidth
            variant="outlined"
            name="contributions"
            value={userData.contributions}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Details"
            fullWidth
            variant="outlined"
            name="details"
            value={userData.details}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Button
        onClick={generateReadme}
        variant="contained"
        color="secondary"
        sx={{ marginTop: "20px" }}
        className="mt-4"
        startIcon={<CloudDownloadIcon />}
        disabled={selectedFields.length < 5} // Disable the button if fewer than 5 fields are selected
      >
        Generate README
      </Button>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Typography mt={1} variant="body2" color="textSecondary">
          Created with ❤️ by{" "}
          <Link
            href="https://github.com/NikeGunn"
            target="_blank"
            rel="noopener"
          >
            Nikhil Bhagat
          </Link>
        </Typography>
      </div>
    </Container>
  );
}

export default App;
