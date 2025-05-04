// utils/category-styling.ts
/**
 * Utilities for consistent category styling across the app
 */

// Get icon for category
export const getCategoryIcon = (categoryName: string): string => {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('rent')) return 'home';
    if (lowerCaseName.includes('utilities')) return 'flash';
    if (lowerCaseName.includes('groceries')) return 'cart';
    if (lowerCaseName.includes('transport')) return 'car';
    if (lowerCaseName.includes('health')) return 'medkit';
    if (lowerCaseName.includes('education')) return 'school';
    if (lowerCaseName.includes('entertainment')) return 'film';
    if (lowerCaseName.includes('shopping')) return 'shirt';
    if (lowerCaseName.includes('food')) return 'restaurant';
    if (lowerCaseName.includes('travel')) return 'airplane';
    if (lowerCaseName.includes('transfer')) return 'arrow-up-outline';
    
    return 'cash';
  };
  
  // Get color for category
  export const getCategoryColor = (categoryName: string): string => {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('rent')) return '#FF9800';
    if (lowerCaseName.includes('utilities')) return '#00BCD4';
    if (lowerCaseName.includes('groceries')) return '#8BC34A';
    if (lowerCaseName.includes('transport')) return '#03A9F4';
    if (lowerCaseName.includes('health')) return '#F44336';
    if (lowerCaseName.includes('education')) return '#9C27B0';
    if (lowerCaseName.includes('entertainment')) return '#673AB7';
    if (lowerCaseName.includes('shopping')) return '#E91E63';
    if (lowerCaseName.includes('food')) return '#FF5722';
    if (lowerCaseName.includes('travel')) return '#607D8B';
    if (lowerCaseName.includes('transfer')) return '#E57373';
    
    return '#3E9E8F';
  };
  
  // Get icon type (ionicons or fontawesome)
  export const getCategoryIconType = (categoryName: string): 'ionicons' | 'fontawesome' => {
    const lowerCaseName = categoryName.toLowerCase();
    
    // Most icons are from Ionicons
    if (lowerCaseName.includes('rent') || 
        lowerCaseName.includes('utilities') || 
        lowerCaseName.includes('groceries') || 
        lowerCaseName.includes('transport') || 
        lowerCaseName.includes('health') || 
        lowerCaseName.includes('entertainment') || 
        lowerCaseName.includes('travel')) {
      return 'ionicons';
    }
    
    // FontAwesome icons
    if (lowerCaseName.includes('education') || 
        lowerCaseName.includes('shopping')) {
      return 'fontawesome';
    }
    
    return 'ionicons';
  };
  
  // Get background color for category icon
  export const getCategoryBgColor = (categoryName: string): string => {
    const color = getCategoryColor(categoryName);
    return `${color}20`; // 20% opacity
  };
  
  // Collection of all utilities for default export
  const CategoryStyling = {
    getCategoryIcon,
    getCategoryColor,
    getCategoryIconType,
    getCategoryBgColor
  };
  
  export default CategoryStyling;