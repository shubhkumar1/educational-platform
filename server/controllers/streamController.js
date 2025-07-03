import LiveStream from '../models/LiveStream.js';

// @desc    Schedule a new live stream
// @route   POST /api/streams/schedule
export const scheduleStream = async (req, res) => {
    const creatorId = req.user._id;

    try {
        const { title, description, youtubeVideoId, scheduledTime } = req.body;
        const newStream = await LiveStream.create({
            title,
            description,
            youtubeVideoId,
            scheduledTime,
            creatorId: creatorId,
        });
        res.status(201).json(newStream);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get a single stream by ID for editing
// @route   GET /api/streams/:id
// @access  Private (for the stream owner)
export const getStreamById = async (req, res) => {
    try {
        const stream = await LiveStream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({ message: 'Stream not found' });
        }
        // Authorization check to ensure only the owner can edit
        if (stream.creatorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        res.json(stream);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all upcoming streams
// @route   GET /api/streams
export const getUpcomingStreams = async (req, res) => {
    try {
        const streams = await LiveStream.find({ scheduledTime: { $gte: new Date() } }).sort({ scheduledTime: 'asc' });
        res.json(streams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateStream = async (req, res) => {
    try {
        const { title, description, youtubeVideoId, scheduledTime } = req.body;
        const stream = await LiveStream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({ message: 'Stream not found' });
        }

        // Authorization Check
        if (stream.creatorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        stream.title = title || stream.title;
        stream.description = description || stream.description;
        stream.youtubeVideoId = youtubeVideoId || stream.youtubeVideoId;
        stream.scheduledTime = scheduledTime || stream.scheduledTime;

        const updatedStream = await stream.save();
        res.json(updatedStream);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete (cancel) a scheduled live stream
// @route   DELETE /api/streams/:id
export const deleteStream = async (req, res) => {
    try {
        const stream = await LiveStream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({ message: 'Stream not found' });
        }

        // Authorization Check
        if (stream.creatorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await stream.deleteOne();
        res.json({ message: 'Scheduled stream removed' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};