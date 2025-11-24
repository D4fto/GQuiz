import React from 'react';
import styles from './UserProfile.module.css';

// Interface do usuário esperada (você pode usar esta estrutura para tipagem TS)
/*
interface UserProfileData {
  id: number;
  created_at: string;
  email: string;
  username: string;
  points: number | null;
  isAdmin: boolean;
  userImgUrl: string; // URL da imagem resolvida da tabela userImgs
}
*/

const UserProfile = ({ user }) => {

  if (!user) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  const formattedDate = new Date(user.created_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        {/* AVATAR: Exibe a imagem ou um placeholder */}
        <div className={styles.profileAvatar}>
          {user.userImgUrl ? (
            <img 
              src={user.userImgUrl} 
              alt={`Imagem de perfil de ${user.username}`} 
              className={styles.avatarImage} 
            />
          ) : (
            <div className={styles.avatarPlaceholder}>👤</div>
          )}
        </div>
        
        <h1 className={styles.username}>
          {user.username}
          {/* Tag de Admin, se aplicável */}
          {user.isAdmin && <span className={styles.adminTag}>👑 Admin</span>}
        </h1>
        <p className={styles.email}>{user.email}</p>
      </header>

      <section className={styles.profileDetails}>
        <h2 className={styles.sectionTitle}>Detalhes da Conta</h2>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>ID:</span>
          <span className={styles.detailValue}>{user.id}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Pontos:</span>
          <span className={styles.detailValue}>{user.points}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Membro desde:</span>
          <span className={styles.detailValue}>{formattedDate}</span>
        </div>

        <div className={`${styles.detailItem} ${styles.statusItem}`}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={user.isAdmin ? styles.statusAdmin : styles.statusUser}>
            {user.isAdmin ? 'Administrador' : 'Usuário Padrão'}
          </span>
        </div>
      </section>

      <footer className={styles.profileFooter}>
        <button className={styles.editButton}>Editar Perfil</button>
      </footer>
    </div>
  );
};

export default UserProfile;