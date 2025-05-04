import React, { createContext, useContext, useState, useEffect } from "react";
import { createLLMActor } from "../IC/LLM/index.js";

const LLMActorContext = createContext(null);

export const useLLMActorLogic = (canisterId = "w36hm-eqaaa-aaaal-qr76a-cai") => {
  const [llmActor, setLLMActor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState("llama3.1:8b");

  // Initialize LLM Actor
  const initializeActor = async () => {
    try {
      setLoading(true);
      setError(null);
      const actor = await createLLMActor(canisterId);
      setLLMActor(actor);
    } catch (err) {
      setError(err.message);
      console.error("LLM Actor initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chatComplete = async ({ model, messages } = { model: 'llama3.1:8b', messages: [] }) => {
    if (!llmActor) throw new Error("LLM Actor not initialized");
    
    try {
      setLoading(true);
      console.log("Original messages:", messages);
  
      // Transform messages to the expected format
      const transformedMessages = messages.map(msg => ({
        role: { user: null }, // Fixed structure you wanted
        content: msg.content
      }));
  
      // Prepare the chat request with correct structure
      const chatRequest = {
        model: model || 'llama3.1:8b', // Use provided model or default
        messages: transformedMessages
      };
  
      console.log("Chat request being sent:", chatRequest);
      const response = await llmActor.v0_chat(chatRequest);
      console.log("Chat response:", response);
      return response;
    } catch (err) {
      console.error("Chat completion error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change model
  const changeModel = (newModel) => {
    setModel(newModel);
  };

  // Auto-initialize
  useEffect(() => {
    initializeActor();
  }, []);

  return {
    // State
    llmActor,
    loading,
    error,
    model,
    isInitialized: !!llmActor,
    
    // Functions
    initializeActor,
    chatComplete,
    changeModel,
  };
};

export const LLMActorProvider = ({ children, canisterId }) => {
  const llm = useLLMActorLogic(canisterId);
  return (
    <LLMActorContext.Provider value={llm}>
      {children}
    </LLMActorContext.Provider>
  );
};

export const useLLMActor = () => {
  const context = useContext(LLMActorContext);
  if (!context) {
    throw new Error("useLLMActor must be used within an LLMActorProvider");
  }
  return context;
};