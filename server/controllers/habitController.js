const Habit = require('../models/Habit');

// @route   GET /api/habits
// @desc    Get all habits for the logged in user
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ data: habits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil habit' });
  }
};

// @route   POST /api/habits
// @desc    Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const { title, icon } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Judul habit wajib diisi' });
    }

    const newHabit = new Habit({
      userId: req.user.id,
      title: title.trim(),
      icon: icon || 'CheckCircle'
    });

    const savedHabit = await newHabit.save();
    res.status(201).json({ message: 'Habit berhasil dibuat', data: savedHabit });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Gagal membuat habit' });
  }
};

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit tidak ditemukan' });
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Habit berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Gagal menghapus habit' });
  }
};

// @route   PATCH /api/habits/:id/toggle
// @desc    Toggle habit completion for a specific local date string
exports.toggleHabit = async (req, res) => {
  try {
    const { dateString } = req.body;
    
    if (!dateString) {
      return res.status(400).json({ message: 'Tanggal wajib disertakan' });
    }

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit tidak ditemukan' });
    }

    const dateExists = habit.completedDates.includes(dateString);
    let updatedHabit;

    if (dateExists) {
      // Uncheck
      updatedHabit = await Habit.findByIdAndUpdate(
        req.params.id,
        { $pull: { completedDates: dateString } },
        { new: true }
      );
    } else {
      // Check
      updatedHabit = await Habit.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { completedDates: dateString } },
        { new: true }
      );
    }

    res.status(200).json({ 
      message: dateExists ? 'Habit dibatalkan' : 'Habit diselesaikan', 
      data: updatedHabit 
    });
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ message: 'Gagal memperbarui status habit' });
  }
};
