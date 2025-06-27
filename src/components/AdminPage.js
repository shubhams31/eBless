import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';

const AdminContainer = styled.div`
  padding: 40px 0;
`;

const AdminHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AdminSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
`;

const ControlsContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const MessagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const MessageCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const MessagePreview = styled.div`
  position: relative;
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
`;

const MessageInfo = styled.div`
  padding: 20px;
`;

const MessageName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const MessageText = styled.p`
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #999;
`;

const MessageActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.variant === 'danger') return '#dc3545';
    if (props.variant === 'success') return '#28a745';
    if (props.variant === 'info') return '#17a2b8';
    return '#667eea';
  }};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

function AdminPage() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        name: 'John Doe',
        message: 'Happy Anniversary Mom and Dad! Thank you for being the best parents anyone could ask for. Your love and support have meant everything to me.',
        type: 'video',
        date: '2024-01-15T10:30:00Z',
        duration: '2:34',
        size: '15.2 MB'
      },
      {
        id: 2,
        name: 'Sarah Smith',
        message: 'Congratulations on another year of love and happiness! You two are an inspiration to us all.',
        type: 'audio',
        date: '2024-01-14T15:45:00Z',
        duration: '1:45',
        size: '8.7 MB'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        message: 'Happy Anniversary! Wishing you many more years of love and laughter together.',
        type: 'video',
        date: '2024-01-13T09:20:00Z',
        duration: '3:12',
        size: '22.1 MB'
      }
    ];

    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(msg => msg.type === filterType);
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, filterType]);

  const handleView = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleEdit = (message) => {
    // In a real app, this would open an edit form
    alert(`Edit functionality for message from ${message.name}`);
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  const handleDownload = (message) => {
    // In a real app, this would trigger a download
    alert(`Downloading ${message.type} message from ${message.name}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const stats = {
    total: messages.length,
    videos: messages.filter(m => m.type === 'video').length,
    audio: messages.filter(m => m.type === 'audio').length
  };

  if (isLoading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Admin Panel</AdminTitle>
        <AdminSubtitle>
          Manage and view all recorded anniversary messages
        </AdminSubtitle>
      </AdminHeader>

      <ControlsContainer>
        <SearchFilterContainer>
          <SearchInput
            type="text"
            placeholder="Search by name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="video">Video Only</option>
            <option value="audio">Audio Only</option>
          </FilterSelect>
        </SearchFilterContainer>

        <StatsContainer>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Messages</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.videos}</StatNumber>
            <StatLabel>Video Messages</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.audio}</StatNumber>
            <StatLabel>Audio Messages</StatLabel>
          </StatCard>
        </StatsContainer>
      </ControlsContainer>

      {filteredMessages.length === 0 ? (
        <EmptyState>
          <h3>No messages found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </EmptyState>
      ) : (
        <MessagesGrid>
          {filteredMessages.map(message => (
            <MessageCard key={message.id}>
              <MessagePreview>
                {message.type === 'video' ? '📹 Video Message' : '🎤 Audio Message'}
              </MessagePreview>
              <MessageInfo>
                <MessageName>{message.name}</MessageName>
                <MessageText>{message.message}</MessageText>
                <MessageMeta>
                  <span>{new Date(message.date).toLocaleDateString()}</span>
                  <span>{message.duration}</span>
                </MessageMeta>
                <MessageActions>
                  <ActionButton onClick={() => handleView(message)}>
                    <FaEye />
                    View
                  </ActionButton>
                  <ActionButton variant="info" onClick={() => handleEdit(message)}>
                    <FaEdit />
                    Edit
                  </ActionButton>
                  <ActionButton variant="success" onClick={() => handleDownload(message)}>
                    <FaDownload />
                    Download
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDelete(message.id)}>
                    <FaTrash />
                    Delete
                  </ActionButton>
                </MessageActions>
              </MessageInfo>
            </MessageCard>
          ))}
        </MessagesGrid>
      )}

      {isModalOpen && selectedMessage && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Message Details</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <div>
              <h3>{selectedMessage.name}</h3>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                {new Date(selectedMessage.date).toLocaleString()}
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedMessage.message}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton variant="success" onClick={() => handleDownload(selectedMessage)}>
                  <FaDownload />
                  Download
                </ActionButton>
                <ActionButton variant="danger" onClick={() => handleDelete(selectedMessage.id)}>
                  <FaTrash />
                  Delete
                </ActionButton>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </AdminContainer>
  );
}

export default AdminPage; 