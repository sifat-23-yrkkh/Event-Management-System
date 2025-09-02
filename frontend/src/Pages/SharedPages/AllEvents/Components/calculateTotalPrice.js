// calculateTotalPrice.js
const calculateTotalPrice = (event, initialEvent) => {
    // Base price from initial event
    const basePrice = initialEvent?.price || 0;
    
    // Feature additions (500 taka per feature)
    const featuresPrice = ((event?.features?.length || 0) - (initialEvent?.features?.length || 0)) * 500;
    
    // Calculate parameter adjustments
    const parameterChanges = {
      photography_team_size: {
        diff: (event?.photography_team_size || 0) - (initialEvent?.photography_team_size || 0),
        pricePerUnit: 300
      },
      duration_hours: {
        diff: (event?.duration_hours || 0) - (initialEvent?.duration_hours || 0),
        pricePerUnit: 1000
      },
      expected_attendance: {
        diff: (event?.expected_attendance || 0) - (initialEvent?.expected_attendance || 0),
        pricePerUnit: 50
      },
      staff_team_size: {
        diff: (event?.staff_team_size || 0) - (initialEvent?.staff_team_size || 0),
        pricePerUnit: 500
      }
    };

    const parameterAdjustments = Object.values(parameterChanges)
      .reduce((total, { diff, pricePerUnit }) => total + (diff * pricePerUnit), 0);

    return basePrice + featuresPrice + parameterAdjustments;
};

export default calculateTotalPrice;