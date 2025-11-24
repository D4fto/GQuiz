import NavBar from "../../components/NavBar/NavBar";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./userProfile.module.css";

export default function UserProfilePage() {
  return (
    <div className={styles.page}>
      <NavBar />
      <UserProfile />
    </div>
  );
}
