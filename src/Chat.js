import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Logo from "../Logo";
import apiService from "../apiService";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RotatingShineBox from "../RotatingShineBox";
import { toast } from "react-toastify";
import YAML from "yaml";
import profile from "../images/Media.png";
import flippedBG from "../images/flippedBG.svg";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate } from "react-router-dom";

function Chat() {
  const models = [
    { label: "OpenAI", value: "gpt-4o" },
    { label: "AzureAI", value: "azure-gpt-4o" },
  ];
  const [selectedModel, setSelectedModel] = useState(models[1]);
  const [prompt, setPrompt] = useState("");
  const [openAPIyaml, setopenAPIYaml] = useState("");
  const [yaml, setYaml] = useState("");
  const [tag, setTag] = useState("");
  const navigate = useNavigate();

  const [chat, setChat] = useState([
    {
      role: "system",
      content:
        "You are an assistant designed to help create YAML configurations for Kong API Gateway. Collect the necessary details for defining a Kong service and routes interactively asking each question separately, and then generate a YAML file which should follow Kong's format version 3.0 and always add tag to every object with same name as service but replace all speacial characters with ' _ ' in the tag and if user sends back any yaml error back to you then change service name to service-name-trail-1 the -2 etc. Make sure routes related to service are inside of that service object",
    },
    {
      role: "user",
      content:
        "I want to create a Kong service. Please ask required details interactively:\n1. Service Name\n2. Target URL\n3. Any additional plugins like rate limiting , request transformer , CORS and more and also collect details for plugins\n\nThen proceed to collect route details:\n1. Route Name\n2. Route Path\n3. Route Header",
    },
    {
      role: "assistant",
      content:
        "Hi there, let's start with the details for the Kong service.\n\n1. What would you like to name the service?",
    },
  ]);
  const [commandSent, setIsCommandSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const promptHandler = (role, value) => {
    const newMessage = { role: role, content: value };
    setChat((preVal) => [...preVal, newMessage]);
  };

  const parseYaml = (yamlContent) => {
    const parsed = YAML.parse(yamlContent);
    return parsed.services?.[0]?.tags[0] || "Service name not found";
  };
  const fetchOpenApiYaml = async () => {
    try {
      const payload = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an assistant designed to help create YAML configurations for openApi code generation based on this kong yaml - ${yaml} if versions are not specified please use latest versions. Please try to create openAPi yaml relevant to kong yaml and just give final yaml with no extra explanation or details`,
          },
        ],
      };
      const response = await apiService.post("/assist", payload, {
        headers: { model: selectedModel.value },
      });
      console.log(response.data.choices[0].message.content);
      const reply = response.data.choices[0].message.content;
      setopenAPIYaml(getTextParts(reply, "```yaml", "```").between);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(openAPIyaml);

  const fetchYaml = async (error) => {
    const newMessage = { role: "user", content: prompt || error };
    const updatedChat = [...chat, newMessage]; // Ensure chat includes the new message
    setChat(updatedChat); // Update state

    try {
      const payload = {
        model: "gpt-4o",
        messages: updatedChat,
      };
      setLoading(true);
      const response = await apiService.post("/assist", payload, {
        headers: { model: selectedModel.value },
      });
      console.log(response.data.choices[0].message.content);
      promptHandler("assistant", response?.data?.choices[0]?.message?.content);
      const reply = response.data.choices[0].message.content;
      if (isYaml(reply, "```yaml")) {
        setYaml(getTextParts(reply, "```yaml", "```").between);
        setTag(parseYaml(getTextParts(reply, "```yaml", "```").between));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };
  const handleCopyToClipboard = (data) => {
    navigator.clipboard.writeText(data).then(
      () => {
        alert("YAML copied to clipboard!");
      },
      (err) => {
        alert("Failed to copy YAML: " + err);
      }
    );
  };
  console.log(yaml);
  console.log(tag);

  const handleDownloadYaml = (data) => {
    const blob = new Blob([data], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tag}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendCommand = async () => {
    const command = `Get-Content C:/Users/shaik.mohammed/Downloads/${tag}.yaml | docker exec -i 5ccbb1e3136a deck --kong-addr http://172.28.144.1:8001/ gateway sync --select-tag ${tag}`;
    try {
      setIsCommandSent(true);
      handleDownloadYaml(yaml);
      const response = await fetch("http://localhost:3001/run-cmd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }), // Send the command in the body
      });

      const data = await response.json();
      console.log(data);
      toast.success(data.output);
      if (response.status === 500) {
        fetchYaml(data.error);
      }
    } catch (err) {
      console.log(err);

      toast.error(err);
    } finally {
      setIsCommandSent(false);
    }
  };
  const scrollableRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  // Scroll to the bottom when messages change or on initial render
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getTextParts = (sentence, word1, word2) => {
    const parts = sentence.split(word1);
    if (parts.length > 1) {
      const betweenAndAfter = parts[1].split(word2);
      return {
        before: parts[0].trim(), // Text before the first word
        between: betweenAndAfter[0].trim(), // Text between the words
        after: betweenAndAfter[1]?.trim() || "", // Text after the second word
      };
    }
    return { before: "", between: "", after: "" };
  };

  const isYaml = (sentence, word) => {
    const words = sentence.split(/\s+/);
    const doesWordExist = words.includes(word);
    console.log(doesWordExist);

    return doesWordExist;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "auto",
      }}
    >
      {/* <Button onClick={fetchOpenApiYaml}>fetch</Button> */}
      <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
        <Box
          sx={{
            height: "100%",
            width: "30%",
            boxShadow: "0 0 6px 0.5px rgba(255, 255, 255, 1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => navigate("/home")}>
              <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "0.8rem" }} />
              Back
            </Button>
          </Box>
          <Box
            sx={{
              minWidth: "100%",
              height: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "80%" }}>
              <Logo />
            </Box>
          </Box>
          <Box
            sx={{
              minWidth: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              margin: "1rem 0 0 0",
            }}
          >
            <img
              style={{ opacity: "1" }}
              src={flippedBG}
              width="75%"
              alt="logo"
            ></img>
            <Box sx={{ width: "80%" }}>
              <RotatingShineBox>
                <Typography variant="h3" color="primary">
                  AI KONNECT
                </Typography>
              </RotatingShineBox>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            color: "white",
            height: "100vh",
            width: "70%",
            display: "flex",
            justifyContent: "center",
            gap: "5%",
            // backgroundImage: `url(${AIHands})`,
            // backgroundSize: "contain",
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "bottom",
          }}
        >
          <Box
            sx={{
              width: "100%",
              paddingY: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  width: "85%",
                  boxShadow: "0 0 6px 0.5px rgba(255, 255, 255, 1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: "0 0 50% 50%",
                    }}
                  >
                    <Typography variant="h6">Chat</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Box
                      ref={scrollableRef}
                      sx={{
                        width: "100%",
                        height: "85%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          width: "97%",
                          height: "95%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {chat.slice(2).map((obj, index) =>
                          obj.role === "user" ? (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "100%",
                              }}
                            >
                              <Box
                                sx={{
                                  border: "1px solid white",
                                  padding: "0.5rem",
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  borderRadius: "6px",
                                }}
                              >
                                {obj.content}
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                width: "100%",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  minWidth: "3rem",
                                  maxHeight: "3rem",
                                  minHeight: "3rem",
                                  backgroundImage: `url(${profile})`,
                                  backgroundSize: "contain",
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: "center",
                                  backgroundColor: "rgba(255,255,255,0.8)",
                                  borderRadius: "50%",
                                  // boxShadow:
                                  //   "0 0 6px 0.5px rgba(255, 255, 255, 1)",
                                }}
                              ></Box>
                              <Box
                                sx={{
                                  border: "1px solid black",
                                  padding: "0.5rem",
                                  backgroundColor: "rgba(255,255,255,0.8)",
                                  borderRadius: "6px",
                                  color: "black",
                                }}
                              >
                                {isYaml(obj.content, "```yaml") ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Box>
                                      {
                                        getTextParts(
                                          obj.content,
                                          "```yaml",
                                          "```"
                                        ).before
                                      }
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: "3rem",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          backgroundColor: "rgba(0,0,0,0.5)",
                                          color: "white",
                                          width: "max-content",
                                          display: "flex",
                                          flexDirection: "column",
                                          borderRadius: "6px",
                                          overflow: "hidden",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              width: "100%",
                                              alignItems: "center",
                                              backgroundColor: "white",
                                              padding: "0.2rem",
                                            }}
                                          >
                                            <Typography color="black">
                                              config.yaml
                                            </Typography>
                                            <IconButton
                                              sx={{ margin: "0 0 0 auto" }}
                                              onClick={() =>
                                                handleCopyToClipboard(
                                                  getTextParts(
                                                    obj.content,
                                                    "```yaml",
                                                    "```"
                                                  ).between
                                                )
                                              }
                                            >
                                              <CopyAllIcon />
                                            </IconButton>
                                            <IconButton
                                              onClick={() =>
                                                handleDownloadYaml(
                                                  getTextParts(
                                                    obj.content,
                                                    "```yaml",
                                                    "```"
                                                  ).between
                                                )
                                              }
                                            >
                                              <FileDownloadOutlinedIcon />
                                            </IconButton>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            padding: "0.5rem",
                                            overflow: "scroll",
                                          }}
                                        >
                                          <pre>
                                            {
                                              getTextParts(
                                                obj.content,
                                                "```yaml",
                                                "```"
                                              ).between
                                            }
                                          </pre>
                                        </Box>
                                      </Box>
                                      <Box>
                                        <Button
                                          onClick={sendCommand}
                                          variant="contained"
                                        >
                                          {commandSent ? (
                                            <CircularProgress color="#0b1b34" />
                                          ) : (
                                            "CREATE API"
                                          )}
                                        </Button>
                                      </Box>
                                    </Box>

                                    <Box>
                                      {
                                        getTextParts(
                                          obj.content,
                                          "```yaml",
                                          "```"
                                        ).after
                                      }
                                    </Box>
                                  </Box>
                                ) : (
                                  obj.content
                                )}
                              </Box>
                            </Box>
                          )
                        )}
                        <Box ref={endOfMessagesRef}></Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        margin: "auto 0 0 0",
                        alignItems: "center",
                        width: "100%",
                        height: "15%",
                        position: "sticky",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "98%",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <Autocomplete
                            disablePortal
                            options={models}
                            sx={{ width: 150 }}
                            value={selectedModel}
                            onChange={(e, value) => {
                              setSelectedModel(value);
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="AI Model" />
                            )}
                          />
                          <Box
                            sx={{
                              width: "60%",
                            }}
                          >
                            <TextField
                              label="What’s your API today?"
                              onChange={(e) => setPrompt(e.target.value)}
                              fullWidth
                              value={prompt}
                              sx={{
                                "& .MuiInputBase-input": {
                                  resize: "none", // Prevents resizing
                                },
                              }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              // margin: "0 0 0 auto",
                            }}
                          >
                            <Button
                              disabled={!prompt}
                              sx={{
                                width: "max-content",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "auto 0 0 auto",
                              }}
                              variant="contained"
                              onClick={() => {
                                fetchYaml();
                              }}
                            >
                              {loading ? (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CircularProgress color="#0b1b34" />
                                </Box>
                              ) : (
                                "Send"
                              )}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
