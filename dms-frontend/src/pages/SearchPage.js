import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  MessageSquare, 
  FileText, 
  Send, 
  Sparkles,
  ArrowRight,
  User,
  Bot,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export const SearchPage = () => {
  const { api } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await api.post('/search', { query: searchQuery, limit: 10 });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info('No results found');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await api.post('/chat', { 
        message: userMessage, 
        session_id: sessionId 
      });
      
      setSessionId(response.data.session_id);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response,
        sources: response.data.sources
      }]);
    } catch (error) {
      toast.error('Failed to get response');
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.',
        isError: true
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const startNewChat = () => {
    setChatMessages([]);
    setSessionId(null);
    toast.success('Started new conversation');
  };

  return (
    <div className="p-8 h-screen overflow-hidden" data-testid="search-page">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-outfit tracking-tight text-zinc-900">Knowledge Search</h1>
          <p className="text-zinc-500 mt-1">Search documents or chat with your knowledge base</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="search" className="gap-2" data-testid="search-tab">
              <Search className="h-4 w-4" />
              Semantic Search
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2" data-testid="chat-tab">
              <MessageSquare className="h-4 w-4" />
              RAG Chat
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="flex-1 space-y-6 mt-0">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search across all documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-24 h-14 text-lg border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                data-testid="search-input"
              />
              <Button 
                type="submit" 
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-zinc-900 hover:bg-zinc-800"
                data-testid="search-submit-btn"
              >
                {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </form>

            {/* Search Results */}
            <Card className="flex-1">
              <CardHeader className="border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-outfit">Results</CardTitle>
                  {searchResults.length > 0 && (
                    <Badge variant="secondary">{searchResults.length} matches</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-380px)]">
                  {searchResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                      <Search className="h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">Search your knowledge base</p>
                      <p className="text-sm">Enter a query to find relevant information</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-zinc-50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                          data-testid={`search-result-${index}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-zinc-900">{result.filename}</p>
                                <Badge variant="outline" className="text-xs">
                                  {(result.score * 100).toFixed(0)}% match
                                </Badge>
                              </div>
                              <p className="text-sm text-zinc-600 line-clamp-3">{result.chunk_text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0">
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="border-b border-zinc-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg font-outfit">AI Knowledge Assistant</CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={startNewChat}
                    data-testid="new-chat-btn"
                  >
                    New Chat
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <ScrollArea className="flex-1 p-4">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Bot className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-lg font-medium text-zinc-700 mb-2">Ask me anything</p>
                      <p className="text-sm text-center max-w-md">
                        I can help you find information from your uploaded documents and answer questions based on your knowledge base.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        {[
                          'What documents do we have?',
                          'Summarize the key points',
                          'Find information about...',
                          'Compare topics across docs'
                        ].map((suggestion, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="text-sm text-left justify-start h-auto py-2 px-3"
                            onClick={() => setChatInput(suggestion)}
                            data-testid={`chat-suggestion-${i}`}
                          >
                            <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}
                          data-testid={`chat-message-${index}`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          
                          <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                            <div className={`rounded-lg p-3 ${
                              msg.role === 'user' 
                                ? 'bg-zinc-900 text-white' 
                                : msg.isError 
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-zinc-100 text-zinc-900'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {msg.sources.map((source, i) => (
                                  <Badge 
                                    key={i} 
                                    variant="outline" 
                                    className="text-xs gap-1 bg-white"
                                  >
                                    <FileText className="h-3 w-3" />
                                    {source.filename}
                                    <span className="text-zinc-400">({(source.relevance * 100).toFixed(0)}%)</span>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {msg.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-zinc-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {chatLoading && (
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="bg-zinc-100 rounded-lg p-3">
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <form onSubmit={handleChat} className="border-t border-zinc-100 p-4 flex-shrink-0">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Ask a question about your documents..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={chatLoading}
                      className="flex-1 focus-ring"
                      data-testid="chat-input"
                    />
                    <Button 
                      type="submit" 
                      disabled={chatLoading || !chatInput.trim()}
                      className="bg-zinc-900 hover:bg-zinc-800"
                      data-testid="chat-submit-btn"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
