import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 0 20px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  font-size: 24px;
  font-weight: 700;
  
  svg {
    color: #e74c3c;
    font-size: 28px;
  }
  
  &:hover {
    color: #e74c3c;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &.active {
    background: #667eea;
    color: white;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
  }
`;

function Header({ isAuthenticated, onLogout }) {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <FaHeart />
          eBlessings
        </Logo>
        
        <Nav>
          <NavLink 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Record Message
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/admin" 
                className={location.pathname === '/admin' ? 'active' : ''}
              >
                <FaCog />
                Admin Panel
              </NavLink>
              <LogoutButton onClick={onLogout}>
                <FaSignOutAlt />
                Logout
              </LogoutButton>
            </>
          ) : (
            <NavLink to="/admin">
              <FaCog />
              Admin
            </NavLink>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 